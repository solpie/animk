/// <reference path="Layer.ts"/>
/// <reference path="PsdImage.ts"/>

var jDataView = require('jdataview');

class PsdFile {
    width;
    height;
    colorSpace;
    colorMode;
    hasAlpha;
    numChannel;
    imageData:PsdImage;
    layers:Array<Layer>;
    COLOR_MODE = {gray: 1, rgb: 3};

    constructor(width, height, colorSpace) {
        // init params
        this.width = (typeof width === 'number') ? width : 0;
        this.height = (typeof height === 'number') ? height : 0;
        this.colorSpace = colorSpace.match(/^(gray|rgb)a?$/) ? colorSpace : 'rgba';
        this.colorMode = this.colorSpace.match(/^graya?$/) ? 'gray' : 'rgb';
        this.hasAlpha = (this.colorSpace === this.colorMode + 'a');
        this.numChannel = (this.colorMode === 'rgb') ? 3 : 1;
        this.numChannel += this.hasAlpha ? 1 : 0;
        this.imageData = null;

        // init layer
        this.layers = [];
    }

    appendLayer(layer:Layer) {
        this.layers.push(layer);
        return this;
    }


    toBinary() {
        // header
        var header = this._getHeaderBinary(this);

        // Color Mode Data Block
        var colorModeData = new Buffer(4);
        colorModeData.writeUInt32BE(0);

        // Image Resources Block
        var imageResources = new Buffer(4);
        imageResources.writeUInt32BE(0);

        // Layer Block
        var layerData = this._createLayerBlockBuffer(this);

        // Image Data Block
        var imageData = this.imageData.toBinary();
        console.log(this, "imageData buffer", imageData, imageData.length);
        // return buffer
        var data = Buffer.concat([
            header,
            colorModeData,
            imageResources,
            layerData,
            imageData
        ]);
        return data;
    }

    _getHeaderBinary(psd) {
        var header = new Buffer(26);
        header.fill(0);
        header.write('8BPS'); // Signature 4
        header.writeUInt16BE(1, 4); // Version 1  +2=6
        //header.writeUint16(0); // Reserved   +2=8
        //header.writeUint16(0); // Reserved   +2=10
        //header.writeUint16(0); // Reserved   +2=12
        header.writeUInt16BE(psd.numChannel,12); // number of color chunnel +2=14
        header.writeUInt32BE(psd.height,14); // rows +4=18
        header.writeUInt32BE(psd.width,18); // columns +4=22
        header.writeUInt16BE(8,22); // Depth  +2 = 24
        header.writeUInt16BE(psd.COLOR_MODE[psd.colorMode],24); // color mode
        return header;
    }

    _createLayerBlockBuffer(psd) {
        if (psd.layers.length === 0) {
            var nullLayer = new Buffer(4);
            nullLayer.writeUInt32BE(0);
            return nullLayer;
        }

        // layer records
        var layerRecords = Buffer.concat(psd.layers.map(function (layer) {
            return layer.toBinary();
        }));

        // layer channel image data
        var layerChannelImageData = Buffer.concat(psd.layers.map(function (layer:Layer) {
            return layer.getChannelImageBinary();
        }));

        // layer info length
        var layerInfoLength = 4 + 2 + layerRecords.length +
            layerChannelImageData.length;

        // layer padding
        var layerInfoPadding = new Buffer(layerInfoLength % 2);
        layerInfoPadding.fill(0);
        layerInfoLength += layerInfoPadding.length;

        // layer info header
        var layerInfoHeader = new Buffer(4 + 2);
        layerInfoHeader.writeUInt32BE(layerInfoLength - 4); // Length of the layers info
        var layerCount = psd.layers.length;
        layerInfoHeader.writeInt16BE(layerCount, 4); // Layer count

        // layer info
        var layerInfo = Buffer.concat([
            layerInfoHeader,
            layerRecords,
            layerChannelImageData,
            layerInfoPadding
        ]);

        // Global layer mask info
        var globalLayerMaskInfoSize = 4 + 2 + 8 + 2 + 1 + 1;
        var globalLayerMaskInfo = new Buffer(globalLayerMaskInfoSize);
        globalLayerMaskInfo.writeUInt32BE(globalLayerMaskInfoSize - 4); // length
        //globalLayerMaskInfo.writeUint16(0); // Overlay color space
        //globalLayerMaskInfo.writeUint32(0); // 4 * 2 byte color components
        //globalLayerMaskInfo.writeUint32(0); // 4 * 2 byte color components
        //globalLayerMaskInfo.writeUint16(0); // Opacity
        //globalLayerMaskInfo.writeUint8(0); // kind
        //globalLayerMaskInfo.writeUint8(0); // Filler: zeros

        // layer block
        var layerHeader = new Buffer(4);
        var layerLength = layerInfo.length + globalLayerMaskInfoSize;
        layerHeader.writeUInt32BE(layerLength); // Length of the layer section
        // layer data
        return Buffer.concat([
            layerHeader,
            layerInfo,
            globalLayerMaskInfo
        ]);
    }

}