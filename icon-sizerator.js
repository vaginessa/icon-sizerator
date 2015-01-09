var inkscape = Meteor.npmRequire('inkscape');

// inkscape -z -e ei-image.png -w 1024 -h 1024 ei-image.svg
// https://www.npmjs.com/package/inkscape
// https://inkscape.org/doc/inkscape-man.html

if (Meteor.isClient) {
  var sourceImage = handed-from-html;

  var sizes = {
    "config": {
      "directory": "outputs/",
      "prefix": "icon",
      "suffix": ".png",
      "suffixRetina":"@2x.png"
    },
    "data": [
      { "size": 29, "customDefault": "-small" },
      { "size": 40 },
      { "size": 50 },
      { "size": 57, "customDefault": "" },
      { "size": 60 },
      { "size": 72 },
      { "size": 76 }
    ]
  };

  sizes.data.map(function (value, index) {
    // Output directory
    var outDir = sizes.config.directory;

    // Image name changes if `customDefault` is defined
    var imageName = sizes.config.prefix;
    imageName += (typeof value.customDefault) !== 'undefined' ? value.customDefault : '-' + value.size;

    // Image suffix and extension for retina and non-retina
    var suffix = sizes.config.suffix;
    var suffixRetina = sizes.config.suffixRetina;

    // Inkscape options for non-retina
    var options = {
      srcPath: sourceImage,
      quality: 1,
      dstPath: outDir + imageName + suffix,
      width: value.size
    };

    // Inkscape options for retina
    var optionsRetina = {
      srcPath: sourceImage,
      quality: 1,
      dstPath: outDir + imageName + suffixRetina,
      width: (value.size)*2
    };

    inkscape.resize(options, function (err) {
      if (err) { throw err; }
    });

    inkscape.resize(optionsRetina, function (err) {
      if (err) { throw err; }
    });
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
