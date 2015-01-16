var fs = require('fs');
var archiver = require('archiver');
var log  = require('custom-logger').config({
  level: 0
});

module.exports = function(randomString) {

  log.debug("In directory-archive, randomString is set to " + randomString);
  log.debug(fs.readdirSync(randomString));

  var zipFile = fs.createWriteStream(randomString + ".zip");
  var archive = archiver('zip');

  zipFile.on('close', function() {
    log.info(archive.pointer() + ' total bytes');
    log.info(randomString + '.zip has been created and closed.');
  });

  archive.on('Error', function(err) {
    log.error(err);
    return;
  });

  archive.pipe(zipFile);
  archive.bulk([ {
    expand: true,
    cwd: randomString,
    src: ['**'],
    dest: randomString
  }]);
  archive.finalize();

};
