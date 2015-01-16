var http = require('http');
var fs   = require('fs');
var rs   = require('randomstring');
var fm   = require('formidable');
var util = require('util');
var fse  = require('fs-extra');
var ar   = require('archiver');
var iim  = require('./ios-icon-maker.js');
var log  = require('custom-logger').config({
  level: 0
});

http.createServer(function(req, res) {

  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {

    // creates a new incoming form.
    var form = new fm.IncomingForm();

    // parse a file upload
    form.parse(req, function(err, fields, files) {
      res.writeHead(200, {
        'content-type': 'text/plain'
      });
      res.write('Upload received :\n');
      res.end(util.inspect({
        fields: fields,
        files: files
      }));
    });

    form.on('end', function(fields, files) {
      var randomString = rs.generate(10);
      var temp_path = this.openedFiles[0].path;
      var file_name = this.openedFiles[0].name;
      var new_location = randomString + '/';
      log.debug(randomString);
      fse.copy(temp_path, new_location + file_name, function(err) {
        if (err) {
          log.error(err);
        } else {
          log.info("File saved to " + new_location + file_name);
          var sourceImage = new_location + file_name;
          log.debug(sourceImage);
          log.debug(randomString);
          iim(sourceImage, randomString, function(err) {
            if (err) {
              throw err;
            }
          });

          var zipFile = fs.createWriteStream(randomString + ".zip");
          var archive = ar('zip');

          zipFile.on('close', function() {
            log.info(archive.pointer() + ' total bytes');
            log.info('Zip file has been created and closed.');
          });

          archive.on('Error', function(err) {
            throw err;
          });

          archive.pipe(zipFile);
          archive.bulk([ {
            expand: true,
            cwd: randomString,
            src: ['**'],
            dest: randomString
          }]);
          archive.finalize();

        }
      });
    });
    return;
  } else if (req.url == "/" || req.url == "/index.html") {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync('icon-sizerator.html'));
    log.debug("Sent HTML.");
  } else if (req.url == "/icon-sizerator.css") {
    res.writeHead(200, {
      'Content-Type': 'text/css'
    });
    res.end(fs.readFileSync('icon-sizerator.css'));
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
