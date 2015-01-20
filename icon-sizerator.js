var http = require('http');
var fs = require('fs');
var rs = require('randomstring');
var fm = require('formidable');
var im = require('imagemagick-native');
var util = require('util');
var archiver = require('archiver');
var fsExtra = require('fs-extra');
var async = require('async');
var log = require('custom-logger').config({
  level: 0
});

http.createServer(function(req, res) {

  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

    // creates a new incoming form.
    var form = new fm.IncomingForm();

    // parse a file upload
    form.parse(req, function(err, fields, files) {
      /*
      res.writeHead(200, {
        'content-type': 'text/plain'
      });
      res.write('Upload received :\n');
      res.end(util.inspect({
        fields: fields,
        files: files
      }));
      */
    });

    var temp_path = '';
    var file_name = '';
    var new_location = '';
    var randomString = '';
    var sourceImage = '';

    async.waterfall([
      function(cb) {
        form.on('end', function(fields, files) {
          randomString = rs.generate(10);
          log.debug(randomString);

          temp_path = this.openedFiles[0].path;
          file_name = this.openedFiles[0].name;
          new_location = randomString + '/';

          sourceImage = '';
          log.debug('Finished form open');
          cb();
        });
      },
      function(cb) {
        fsExtra.copy(temp_path, new_location + file_name, function(err) {
          if (err) {
            log.error(err);
          } else {
            log.info("File saved to " + new_location + file_name);
            sourceImage = new_location + file_name;
            log.debug(sourceImage);
            log.debug(randomString);
          }
          log.debug('Finished running fsExtra.copy');
          cb();
        });
      },
      function(cb) {

        var header = {
          "Content-Type": "application/x-zip",
          "Pragma": "public",
          "Expires": "0",
          "Cache-Control": "private, must-revalidate, post-check=0, pre-check=0",
          "Content-disposition": 'attachment; filename="' + randomString + ".zip" + '"',
          "Transfer-Encoding": "chunked",
          "Content-Transfer-Encoding": "binary"
        };

        var zip = archiver('zip');

        res.writeHead(200, header);
        zip.store = true;  // don't compress the archive
        zip.pipe(res);

        var sizes = {
          "config": {
            "directory": randomString + "/",
            "prefix": "icon",
            "suffix": ".png",
            "suffixRetina": "@2x.png",
            "suffixRetinaPlus": "@3x.png"
          },
          "data": [{
            "size": 29,
            "customDefault": "-small"
          }, {
            "size": 40
          }, {
            "size": 50
          }, {
            "size": 57,
            "customDefault": ""
          }, {
            "size": 60
          }, {
            "size": 72
          }, {
            "size": 76
          }]
        };

        sizes.data.map(function(value, index) {
          // Output directory
          var outDir = sizes.config.directory;

          // Image name changes if `customDefault` is defined
          var imageName = sizes.config.prefix;
          imageName += (typeof value.customDefault) !== 'undefined' ? value.customDefault : '-' + value.size;

          // Image suffix and extension for retina and non-retina
          var suffix = sizes.config.suffix;
          var suffixRetina = sizes.config.suffixRetina;
          var suffixRetinaPlus = sizes.config.suffixRetinaPlus;

          // ImageMagick options for non-retina
          var options = {
            srcPath: sourceImage,
            quality: 1,
            dstPath: outDir + imageName + suffix,
            width: value.size
          };

          // ImageMagick options for retina
          var optionsRetina = {
            srcPath: sourceImage,
            quality: 1,
            dstPath: outDir + imageName + suffixRetina,
            width: (value.size) * 2
          };

          var optionsRetinaPlus = {
            srcPath: sourceImage,
            quality: 1,
            dstPath: outDir + imageName + suffixRetinaPlus,
            width: (value.size) * 3
          };

          fs.writeFileSync("target.png", im.convert({
            srcData: fs.readFileSync(sourceImage),
            width: 100,
            height: 100
          }));
          log.debug('Image resized.');

          zip.file('target.png', {
            name: 'target.png'
          });
          log.debug('Added to zip');

          // ^^^^ Integrate this against all the files, correct params etc.
          // Also, tie this in with the archive stuff.

          /*
          // Process non-retina icons
          im.resize(options, function(err) {
            if (err) {
              log.error(err);
            }
            log.info('Created icon ' + outDir + imageName + suffix);
            fs.readFile(outDir + imageName + suffix, function(err) {
              if (err) {
                log.error(err);
              }
              zip.file(outDir + imageName + suffix, {
                name: outDir + imageName + suffix
              });
            });
          });

          // Process retina icons
          im.resize(optionsRetina, function(err) {
            if (err) {
              log.error(err);
            }
            log.info('Created icon ' + outDir + imageName + suffixRetina);
            fs.readFile(outDir + imageName + suffixRetina, function(err) {
              if (err) {
                log.error(err);
              }
              zip.file(outDir + imageName + suffixRetina, {
                name: outDir + imageName + suffixRetina
              });
            });
          });

          im.resize(optionsRetinaPlus, function(err) {
            if (err) {
              log.error(err);
            }
            log.info('Created icon ' + outDir + imageName + suffixRetinaPlus);
            fs.readFile(outDir + imageName + suffixRetinaPlus, function(err) {
              if (err) {
                log.error(err);
              }
              zip.file(outDir + imageName + suffixRetinaPlus, {
                name: outDir + imageName + suffixRetinaPlus
              });
            });
          });
          */

        });
        log.debug('Finished running iconGen');

        zip.finalize();
        log.debug('Zip ready for delivery');

        cb();
      }
    ], function() {
      log.debug('All done!');
    });

    return;
  } else if (req.url == "/" || req.url == "/index.html") {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync('public/icon-sizerator.html'));
    log.debug("Sent HTML.");
  } else if (req.url == "/icon-sizerator.css") {
    res.writeHead(200, {
      'Content-Type': 'text/css'
    });
    res.end(fs.readFileSync('public/icon-sizerator.css'));
    log.debug("Sent CSS.");
  } else if (req.url == "/ei-image.svg") {
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml'
    });
    res.end(fs.readFileSync('public/ei-image.svg'));
    log.debug("Sent SVG.");
  } else if (req.url == "/ei-image.png") {
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(fs.readFileSync('public/ei-image.png'));
    log.debug("Sent PNG.");
  }

}).listen(3000, "127.0.0.1");
log.info('Started HTTP Server on localhost port 3000.');
