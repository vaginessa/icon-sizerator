var http = require('http');
var fs   = require('fs');
var rs   = require('randomstring');
var fm   = require('formidable');
var iim  = require('./ios-icon-maker.js');
var log  = require('custom-logger').config({
  level: 0
});

http.createServer(function(req, res) {

  if (req.url == "/" || req.url == "/index.html") {
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
  } else if (req.method == 'POST') {
    log.debug("POST Received.");

    if (req.url === "/upload") {
      var randomName = rs.generate();
      var iconFile = randomName + ".png";
      var transitData = '';

      req.on('data', function(data) {
        transitData += data;
      });

      req.on('end', function() {
        fs.writeFile(iconFile, transitData, 'binary', function(err) {
          if (err) throw err;
        });
        log.debug("File upload is complete.");
      });

      // iim(iconFile, randomName);

    }

  } else {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync('icon-sizerator.html'));
    log.debug("Sent HTML in lieu of 404.");
  }


}).listen(3000, "127.0.0.1");
log.info('Started HTTP Server on localhost port 3000.');
