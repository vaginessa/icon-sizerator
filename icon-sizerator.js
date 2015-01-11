var http = require('http');
var fs = require('fs');
var im = require('imagemagick');

http.createServer(function(req, res) {
  if (req.url == "/" || req.url == "/index.html") {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(fs.readFileSync('icon-sizerator.html'));
    console.log("Sent html\n");
  } else if (req.url == "/icon-sizerator.css") {
    res.writeHead(200, {
      'Content-Type': 'text/css'
    });
    res.end(fs.readFileSync('icon-sizerator.css'));
    console.log("Sent css\n");
  } else if (req.url == "/ei-image.svg") {
    res.writeHead(200, {
      'Content-Type': 'image/svg+xml'
    });
    res.end(fs.readFileSync('public/ei-image.svg'));
    console.log("Sent svg\n");
  } else if (req.url == "/ei-image.png") {
    res.writeHead(200, {
      'Content-Type': 'image/png'
    });
    res.end(fs.readFileSync('public/ei-image.png'));
    console.log("Sent png\n");
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/plain'
    });
    res.end("Page could not be found");
  }
}).listen(3000, "127.0.0.1");
console.log('Started HTTP Server on localhost port 3000.');
