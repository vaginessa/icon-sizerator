# Icon Sizerator - Apple App Store icon generator

This tool is a standalone service built in JavaScript on Node.js, which serves to assist iOS App creators in icon generation.  Contributions of issues and pull requests are most welcome.

![](https://github.com/davidjpeacock/icon-sizerator/blob/master/icon-sizerator-ss.png)

Icon Sizerator is designed with throughput and low-cost in mind.  The backend image processing is performed by ImageMagick.

## Usage

You can of course use the provided service at ![Icon Sizerator](http://icon-sizerator.davidjpeacock.ca/)

## Installation

If you wish to install this locally you can do so simply:
```
git clone https://github.com/davidjpeacock/icon-sizerator.git
cd icon-sizerator/
sudo npm install
node icon-sizerator.js
```
## TODO

* Auto-clean stale uploads/* folders; currently this is performed by a cron job, but this should happen within the code itself.

