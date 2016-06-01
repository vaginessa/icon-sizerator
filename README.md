# Icon Sizerator - iOS and Android App icon size generator

## SECURITY

Icon Sizerator relies on ImageMagick, which has a [significant vulnerability](https://imagetragick.com/) right now.  I highly recommend that you do not run this code on any publicly accessible server.

[![Build Status](https://travis-ci.org/davidjpeacock/icon-sizerator.svg?branch=master)](https://travis-ci.org/davidjpeacock/icon-sizerator)

This tool is a standalone service built in JavaScript on Node.js, which serves to assist iOS and Android App creators in icon generation.

![](https://github.com/davidjpeacock/icon-sizerator/blob/master/icon-sizerator-ss.png)

Icon Sizerator is designed with throughput and low-cost in mind.  The backend image processing is performed by ImageMagick.

## Usage

You may of course use the provided service at http://icon-sizerator.davidjpeacock.ca/

Upload a source icon PNG or JPEG of at least 1024x1024, wait a little while, and we'll deliver a zip file filled with all the right sizes!

## Installation

If you wish to install this locally, you'll need to install ImageMagick through your preferred platform method.

* OS X: `brew install imagemagick`
* Ubuntu: `sudo apt-get install imagemagick libmagick++-dev libmagickcore-dev`

Then you can simply:

```
git clone https://github.com/davidjpeacock/icon-sizerator.git
cd icon-sizerator/
sudo npm install
node icon-sizerator.js
```

## Contributing

Contributions of issues and pull requests are most welcome.
