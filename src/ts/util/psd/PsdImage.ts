/// <reference path="ChImageData.ts"/>
/// <reference path="../../Node.ts"/>
var jDataView = require('jdataview');
class PsdImage {
    width;
    height;
    colorSpace;
    colorMode;
    hasAlpha;
    pixels:Buffer;
    numChannel;
    numPixels;
    channels;

    constructor(width, height, colorSpace, pixels:Buffer) {
        // init params
        this.width = (typeof width === 'number') ? width : 0;
        this.height = (typeof height === 'number') ? height : 0;
        this.colorSpace = colorSpace.match(/^(gray|rgb)a?$/) ? colorSpace : 'rgba';
        this.colorMode = this.colorSpace.match(/^graya?$/) ? 'gray' : 'rgb';
        this.hasAlpha = (this.colorSpace === this.colorMode + 'a');
        this.pixels = pixels;
        this.numChannel = (this.colorMode === 'rgb') ? 3 : 1;
        this.numChannel += this.hasAlpha ? 1 : 0;
        this.numPixels = this.numChannel * this.width * this.height;
        this.channels = [];

        if (this.pixels.length !== this.numPixels) {
            throw new Error('mismatch number of pixels.');
        }
        // init channels
        var self = this;
        var channels = [];
        for (var i = 0; i < this.numChannel; i++) {
            channels.push([]);
        }
        for (i = 0; i < this.numPixels; i += this.numChannel) {
            for (var index = 0; index < this.numChannel; index++) {
                channels[index].push(this.pixels[i + index]);
            }
        }

        this.channels = channels.map(function (channel) {
            return new ChImageData(self.width, self.height, channel);
        });
    }


    toBinary() {
        // set compression type
        var compType = new Buffer(2);
        compType.writeUInt16BE(1, 0); // RLE

        // get compressed image data
        var byteCounts = [];
        var compressedImages = [];
        this.channels.forEach(function (channel:ChImageData) {
            var comp = channel.compressRLE();
            byteCounts.push(comp.byteCounts.buffer);
            compressedImages.push(comp.image.buffer);
        });

        // return binary buffer
        return Buffer.concat([
            compType,
            Buffer.concat(byteCounts),
            Buffer.concat(compressedImages)
        ]);
    }
}