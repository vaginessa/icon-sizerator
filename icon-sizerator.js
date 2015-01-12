var http = require('http');
var fs   = require('fs');
var rs   = require("randomstring");
var iim  = require('./ios-icon-maker.js');
var log  = require('custom-logger').config({
  level: 0
});

http.createServer(function(req, res) {

  var randomName = rs.generate();

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
    
    var iconFile = fs.createWriteStream(randomName + ".png");
    req.pipe(iconFile);

    var fileSize = req.headers['content-length'];
    var uploadedBytes = 0;

    req.on('data', function(d) {
      uploadedBytes += d.length;
      var p = (uploadedBytes / fileSize) * 100;
      res.write("Uploading " + parseInt(p) + " %\n");
      log.debug("Uploading " + parseInt(p) + " %");
    });

    req.on('end', function() {
      res.end("File upload is complete.");
    });

    // iim(iconFile, randomName);

  } else {
      res.writeHead(404, {
        'Content-Type': 'text/plain'
      });
      res.end("404 - Page could not be found\n");
  }


}).listen(3000, "127.0.0.1");
log.info('Started HTTP Server on localhost port 3000.');
