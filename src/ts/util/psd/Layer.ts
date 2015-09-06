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
        //this.name = "te12343s";

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
        var that = this;
        var channelImageData = Buffer.concat(that.channels.map(function (channel) {
            return channel.toBinary().buffer;
        }));

        return new jDataView(channelImageData);
    }

    /**
     * return layer record binary data
     * @return {jDataView} layer record binary data
     */
    toBinary() {
        var that = this;

        // Layer record
        var numChannel = this.channels.length;
        var layerRecordSize = 34 + 4 + 4 + 4 + (6 * numChannel);
        var layerRecord = new jDataView(layerRecordSize);

        // rectangle
        layerRecord.writeUint32(this.top); // top
        layerRecord.writeUint32(this.left); // left
        layerRecord.writeUint32(this.top + this.height); // bottom
        layerRecord.writeUint32(this.left + this.width); // right

        // number of channels in the layer
        layerRecord.writeUint16(numChannel);

        // channnel infomation
        this.channels.forEach(function (channel, index) {
            // id
            var id = (that.hasAlpha && index === numChannel - 1) ? -1 : index;
            layerRecord.writeInt16(id);

            // length
            var channelByteLength = channel.toBinary().byteLength;
            layerRecord.writeUint32(channelByteLength);
        });

        // blend mode signature
        layerRecord.writeString('8BIM');

        // blend mode key
        layerRecord.writeString(this.blendMode);

        // opacity
        layerRecord.writeUint8(Math.round(this.opacity * 255));

        // clipping
        layerRecord.writeUint8(0); // base

        // flags
        layerRecord.writeUint8(parseInt('00001000', 2));

        // filler (zero)
        layerRecord.writeUint8(0);

        // length of the extra data field

        layerRecord.writeUint32(4 + 4 + 4);

        // layer mask data
        layerRecord.writeUint32(0);

        // layer blending ranges data
        layerRecord.writeUint32(0); // length

        // Layer name: Pascal string, padded to a multiple of 4 bytes.
        if (this.name) {
            layerRecord.writeUint8(this.name.length);
            for (var i = 0; i < 3; i++) {//todo name length only 3 char
                var char = this.name[i];
                console.log(this, "char", char.charCodeAt(0));
                layerRecord.writeUint8(char.charCodeAt(0));
            }
        }
        else {
            layerRecord.writeUint8(3);
            layerRecord.writeUint8('P'.charCodeAt(0));
            layerRecord.writeUint8('N'.charCodeAt(0));
            layerRecord.writeUint8('G'.charCodeAt(0));
        }

        return layerRecord;
    }
}