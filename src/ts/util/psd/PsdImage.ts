/// <reference path="ChImageData.ts"/>
/// <reference path="../../Node.ts"/>
var jDataView = require('jdataview');
class PsdImage {
    width;
    height;
    colorSpace;
    colorMode;
    hasAlpha;
    pixcels;
    numChannel;
    numPixcels;
    channels;

    constructor(width, height, colorSpace, pixcels) {
        // init params
        this.width = (typeof width === 'number') ? width : 0;
        this.height = (typeof height === 'number') ? height : 0;
        this.colorSpace = colorSpace.match(/^(gray|rgb)a?$/) ? colorSpace : 'rgba';
        this.colorMode = this.colorSpace.match(/^graya?$/) ? 'gray' : 'rgb';
        this.hasAlpha = (this.colorSpace === this.colorMode + 'a');
        this.pixcels = pixcels;
        this.numChannel = (this.colorMode === 'rgb') ? 3 : 1;
        this.numChannel += this.hasAlpha ? 1 : 0;
        this.numPixcels = this.numChannel * this.width * this.height;
        this.channels = [];

        if (this.pixcels.byteLength !== this.numPixcels) {
            throw new Error('mismatch number of pixcels.');
        }
        console.log(this, "numChannel", this.numChannel);
        // init channels
        var that = this;
        var channels = [];
        for (var i = 0; i < this.numChannel; i++) {
            channels.push([]);
        }
        for (i = 0; i < this.numPixcels; i += this.numChannel) {
            for (var index = 0; index < this.numChannel; index++) {
                if (index == 3)//todo write alpha
                    channels[index].push(100);
                else
                    channels[index].push(this.pixcels.getUint8(i + index));
            }
        }
        this.channels = channels.map(function (channel) {
            var pixcels = new jDataView(channel);
            return new ChImageData(that.width, that.height, pixcels);
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
        //return new jDataView(Buffer.concat([
        //    compType,
        //    Buffer.concat(byteCounts),
        //    Buffer.concat(compressedImages)
        //]));
    }
}