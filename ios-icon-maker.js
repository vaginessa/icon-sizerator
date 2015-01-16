var im = require('imagemagick');
var log = require('custom-logger').config({
  level: 0
});

module.exports = function(sourceImage, randomName) {

  log.debug("In Tinacious, sourceImage is set to " + sourceImage);
  log.debug("In Tinacious, randomName is set to " + randomName);

  var sizes = {
    "config": {
      "directory": "uploads/" + randomName + "/",
      "prefix": "icon",
      "suffix": ".png",
      "suffixRetina": "@2x.png"
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

    // Process non-retina icons
    im.resize(options, function(err) {
      if (err) {
        throw err;
      }
      log.info('Created icon ' + outDir + imageName + suffix);
    });

    // Process retina icons
    im.resize(optionsRetina, function(err) {
      if (err) {
        throw err;
      }
      log.info('Created icon ' + outDir + imageName + suffixRetina);
    });
  });

};
