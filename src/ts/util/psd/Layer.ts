var jDataView = require('jdataview');
class Layer {
    top = 0;
    left = 0;
    width = 0;
    height = 0;
    blendMode = 'norm';
    opacity = 1;
    name = '';
    hasAlpha = true;
    channels = [];

    constructor() {
        this.name = "PNGG";
    }

    /**
     * draw image
     * @param image {ImageData} image data
     */
    drawImage(image) {
        this.width = image.width;
        this.height = image.height;
        this.hasAlpha = image.hasAlpha;
        this.channels = image.channels;
    }

    getChannelImageBinary() {
        var channelImageData = Buffer.concat(this.channels.map(function (channel) {
            return channel.toBinary();
        }));

        return channelImageData;
    }

    /**
     * return layer record binary data
     * @return {jDataView} layer record binary data
     */
    toBinary() {
        var that = this;
        var layerNameDataLen;
        if (!this.name)
            this.name = "PNG";
        layerNameDataLen = Math.ceil((this.name.length + 1) / 4) * 4;

        // Layer record
        var numChannel = this.channels.length;
        var layerRecordSize = 34 + 4 + 4 + layerNameDataLen + (6 * numChannel);
        var layerRecord = new Buffer(layerRecordSize);

        // rectangle
        layerRecord.writeUInt32BE(this.top); // top  0
        layerRecord.writeUInt32BE(this.left, 4); // left 4
        layerRecord.writeUInt32BE(this.top + this.height, 8); // bottom
        layerRecord.writeUInt32BE(this.left + this.width, 12); // right

        // number of channels in the layer
        layerRecord.writeUInt16BE(numChannel, 16);
        var ofs = 16 + 2;
        // channnel infomation
        this.channels.forEach(function (channel, index) {
            // id
            var id = (that.hasAlpha && index === numChannel - 1) ? -1 : index;
            layerRecord.writeInt16BE(id,ofs);
            ofs += 2;
            // length
            var channelByteLength = channel.toBinary().length;
            layerRecord.writeUInt32BE(channelByteLength,ofs);
            ofs += 4;
        });

        // blend mode signature
        layerRecord.write('8BIM',ofs);
        ofs += 4;
        // blend mode key
        layerRecord.write(this.blendMode,ofs);
        ofs += 4;

        // opacity
        layerRecord.writeUInt8(Math.round(this.opacity * 255),ofs);
        ofs += 1;
        // clipping
        layerRecord.writeUInt8(0,ofs); // base
        ofs += 1;

        // flags
        layerRecord.writeUInt8(parseInt('00001000', 2),ofs);
        ofs += 1;

        // filler (zero)
        layerRecord.writeUInt8(0,ofs);
        ofs += 1;

        // length of the extra data field

        layerRecord.writeUInt32BE(4 + 4 + layerNameDataLen,ofs);
        ofs += 4;

        // layer mask data
        layerRecord.writeUInt32BE(0,ofs);
        ofs += 4;

        // layer blending ranges data
        layerRecord.writeUInt32BE(0,ofs); // length
        ofs += 4;

        // Layer name: Pascal string, padded to a multiple of 4 bytes.
        if (this.name) {
            layerRecord.writeUInt8(layerNameDataLen - 1,ofs);
            ofs += 1;

            for (var i = 0; i < this.name.length; i++) {
                var char = this.name[i];
                //console.log(this, "char", char.charCodeAt(0));
                layerRecord.writeUInt8(char.charCodeAt(0),ofs);
                ofs += 1;
            }
        }
        else {
            //layerRecord.writeUint8(3);
            //layerRecord.writeUint8('P'.charCodeAt(0));
            //layerRecord.writeUint8('N'.charCodeAt(0));
            //layerRecord.writeUint8('G'.charCodeAt(0));
        }

        return layerRecord;
    }
}