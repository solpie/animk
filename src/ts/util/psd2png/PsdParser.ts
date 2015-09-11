/// <reference path="ImageHelper.ts"/>
/// <reference path="Descriptor.ts"/>
/// <reference path="Handler.ts"/>
/// <reference path="layer/Record.ts"/>
/// <reference path="../png/Packer.ts"/>

var PNG = require('pngjs').PNG,
    fs = require('fs');
//var MODES = [
//    'BitMap',       //0
//    'Grayscale',    //1
//    'Indexed',      //2
//    'RGB',          //3
//    'CMYK',         //4
//    undefined,      //5
//    undefined,      //6
//    'Multichannel', //7
//    'Duotone',      //8
//    'Lab'           //9
//];
class PsdParser {

    constructor() {

    }

    parse(path) {
        var PSD = this._bufferFile(fs.readFileSync(path));
        this.__parseHeader(PSD);
        this.__parseColorMode(PSD);
        this.__parseImageResources(PSD);
        this.__parseLayerMaskInfo(PSD);
        this.__parseImageData(PSD);
        return new Handler(PSD)
    }


    _bufferFile(buffer) {//file.js
        var jspack = require('jspack').jspack,
            iconv = require('iconv-lite');
        var PSD = {
            file: null
        };
        PSD.file = {};
        PSD.file.buffer = buffer;
        var _pos = 0;

        PSD.file.read = function (length) {
            var self = this;
            var temp = [];
            for (var i = 0; i < length; i++) {
                temp.push(self.buffer[_pos++])
            }
            return temp;
        };

        PSD.file.readByte = function () {
            return this.read(1)[0];
        };

        PSD.file.readShort = function () {
            return jspack.Unpack('h', this.read(2))[0]
        };

        PSD.file.readInt = function () {
            return jspack.Unpack('i', this.read(4))[0]
        };

        PSD.file.readDouble = function () {
            return jspack.Unpack('d', this.read(8))[0]
        };

        PSD.file.readString = function (length) {
            return jspack.Unpack(length + 's', this.read(length))[0].replace(/\u0000/g, '')
        };

        PSD.file.readUnicodeString = function () {
            var bf = this.read(this.readInt() * 2);
            return iconv.decode(new Buffer(bf), 'utf-16be').replace(/\u0000/g, '')
        };

        PSD.file.readBoolean = function () {
            return this.readByte() == 1;
        };

        PSD.file.pad2 = function (i) {
            //向上取整到2的倍数
            return (i + 1) & ~0x01;
        };
        PSD.file.pad4 = function (i) {
            //4的倍数
            return ((i + 4) & ~0x03);
        };
        PSD.file.seek = function (offset, whence) {
            if (!isNaN(whence))
                _pos = whence;
            _pos += offset;
            return _pos
        };
        PSD.file.tell = function (whence) {
            _pos = whence;
            return _pos
        };
        PSD.file.now = function () {
            return _pos;
        };
        return PSD;
    }

    __parseHeader(PSD) {
        var _ = PSD;

        var header = _.header = {
                sig: "",
                version: 0,
                channelsNum: 0,
                height: 0,
                width: 0,
                depth: 0,
                colorMode: 0,
            },
            file = _.file;

        header.sig = file.readString(4);
        if (header.sig !== '8BPS')
            throw 'This file seems not a psd file';

        header.version = file.readShort();
        if (header.version !== 1)
            throw 'This file seems not a psd file';

        file.seek(6); //reserved
        header.channelsNum = file.readShort();

        header.height = file.readInt();
        header.width = file.readInt();

        header.depth = file.readShort();

        header.colorMode = file.readShort();
        return PSD;
    }

    __parseColorMode(PSD) {
        var _ = PSD;


        var colorMode = _.colorMode = {
                startPos: 0,
                length: 0,
                endPos: 0,
            },
            file = _.file;

        colorMode.startPos = file.now();
        colorMode.length = file.readInt();

        file.seek(colorMode.length);

        colorMode.endPos = file.now();
        return PSD;
    }

    __parseImageResources(PSD) {
        var ref1026 = {
            id: 1026,
            name: 'layerLink',
            parse: function (file, size) {
                var linkArr = [];
                var end = file.now() + size;
                while (end > file.now()) {
                    linkArr.push(file.readShort());
                }
                file.tell(end);
                return linkArr.reverse();
            }
        };

        var slicesResourceBlock = function (file) {
            var ID = file.readInt(),
                groupID = file.readInt(),
                origin = file.readInt(),
                layerID;

            if (origin === 1) layerID = file.readInt();

            return {
                ID: ID,
                groupID: groupID,
                origin: origin,
                layerID: layerID,
                name: file.readUnicodeString(),
                type: file.readInt(),
                left: file.readInt(),
                top: file.readInt(),
                right: file.readInt(),
                bottom: file.readInt(),

                url: file.readUnicodeString(),
                target: file.readUnicodeString(),
                message: file.readUnicodeString(),
                alt: file.readUnicodeString(),

                isHTML: file.readBoolean(),
                cellText: file.readUnicodeString(),

                horizontalAlign: file.readInt(),
                verticalAlign: file.readInt(),
                alphaColor: file.readByte(),
                red: file.readByte(),
                green: file.readByte(),
                blue: file.readByte()
            }


        };

        var headerFor6 = function (file) {
            var top = file.readInt(),
                left = file.readInt(),
                bottom = file.readInt(),
                right = file.readInt();

            var groupName = file.readUnicodeString();

            var num = file.readInt();
            var slices = [];
            for (var i = 0; i < num; i++) {
                slices.push(slicesResourceBlock(file));
            }
            return slices
        };

        var headerFor7Later = function (file) {
            file.seek(4);//descriptor version
            return new Descriptor().init(file);
        };

        var ref1050 = {
            id: 1050,
            parse: function (file, size) {
                var startPos = file.now();
                var version = file.readInt();
                var obj;
                if (version == 6) {
                    obj = headerFor6(file)
                }
                if (version == 7 || version == 8) {
                    obj = headerFor7Later(file)
                }
                file.seek(size, startPos);
                return obj
            }
        };
        var ref = [
                ref1026,
                ref1050
            ],

            Resources = {};

        ref.forEach(function (o) {
            Resources[o.id] = o;
        });
        var _ = PSD;

        var imageResources = _.imageResources = {
                startPos: 0,
                length: 0,
                endPos: 0,
                imageResourceBlock: null,
            },
            file = _.file;

        var startPos = imageResources.startPos = file.now(),
            length = imageResources.length = file.readInt();

        var endPos = startPos + length;
        var block = imageResources.imageResourceBlock = {};

        while (file.now() < endPos) {
            var sig = file.readString(4),
                id = file.readShort(),
                nameSize = file.readByte(),//pascal string; first byte meas length
                nameLength = file.pad2(nameSize === 0 ? 1 : nameSize) - 1,
                name = file.readString(nameLength),
                size = file.pad2(file.readInt()); //data length


            if (Resources[id]) {
                block[id] = Resources[id].parse(file, size);
            } else {
                file.seek(size);
            }
        }
        imageResources.endPos = file.now();
    }

    __parseLayerMaskInfo(PSD) {
        var _ = PSD;
        var layerMaskInfo = _.layerMaskInfo = {
                startPos: 0,
                length: 0,
                layerInfo: null,
                globalMask: null,
            },//todo refactor to class
            file = _.file;
        var startPos = layerMaskInfo.startPos = file.now();

        var length = layerMaskInfo.length = file.readInt();
        //layers
        var layerInfo = layerMaskInfo.layerInfo = {
            length: 0,
            layerCount: 0,
            layers: null,
        };

        layerInfo.length = file.pad2(file.readInt());

        layerInfo.layerCount = file.readShort();
        _.mergedAlpha = false;

        if (layerInfo.layerCount < 0) {
            layerInfo.layerCount = -layerInfo.layerCount;
            _.mergedAlpha = true; //
        }

        layerInfo.layers = [];
        for (var i = 0; i < layerInfo.layerCount; i++) {
            layerInfo.layers.push(Records.parseLayer(file));
        }

        layerInfo.layers.forEach((layer) => {
            this.___parseChannelImage(layer, file, _.header.colorMode);
        });

        layerMaskInfo.globalMask = this.___parseGlobalMask(file);

        layerInfo.layers.reverse();

        file.seek(length, startPos + 4)
    }

    ___parseGlobalMask(file) {
        var length = file.readInt(),
            pos = file.now();
        var overlayColorSpace = file.readShort(),
            colorComponents = [
                file.readShort(),
                file.readShort(),
                file.readShort(),
                file.readShort()
            ],
            opacity = file.readShort(),
            kine = file.readByte();

        file.seek(length, pos);
        return {
            overlayColorSpace: overlayColorSpace,
            colorComponents: colorComponents,
            opacity: opacity,
            kine: kine
        }
    }

    ____parseCompression(file) {
        return file.readShort()
    }

    ____parseImageData(layer, file) {
        var compression = this.____parseCompression(file);
        return imageFun.layerFormat[compression](layer, file);
    }

    ___parseChannelImage(layer, file, colorMode) {
        var parsed = false;
        var pos = file.now();

        for (var i = 0, l = layer.channelInfo.length; i < l; i++) {
            //skip first
            var channel = layer.channelInfo[i];
            file.seek(channel.length, file.now());
        }

        layer.parseImageData = function () {
            var self = this;

            if (parsed) return self.pixelData;

            file.tell(pos);
            for (var i = 0, l = self.channelInfo.length; i < l; i++) {
                var channel = self.channelInfo[i];
                if (channel.length <= 0) {
                    this.____parseCompression(file);// 压缩位
                    channel.data = [];
                    continue;
                }

                var startPos = file.now();
                var compression = file.readShort();
                channel.data = imageFun.layerFormat[compression](layer, file);
                file.seek(channel.length, startPos);
            }
            self.pixelData = imageFun.mergeImageData(self, colorMode);
            parsed = true;
            return self.pixelData
        };

        layer.saveAsPng = function (output, callback) {
            var self = this;
            self.parseImageData();
            var png = new PNG({
                width: self.width + layer.left,
                height: self.height + layer.top,
                filterType: 4
            });
            if (self.pixelData) {
                png.data = PsdParser.transPixels(self.width, self.height, self.pixelData, layer.left, layer.top);
                //png.data = self.pixelData;
                var dst = fs.createWriteStream(output);
                dst.on("finish", callback);
                png.pack().pipe(dst);
            } else {
                throw 'Not support the colorMode'
            }
        };
    }

    static transPixels(pixW, pixH, pix, left, top) {
        var w = pixW + left;
        var h = pixH + top;
        var transPixels = new Buffer(w * h * 4);
        transPixels.fill(0);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (x >= left && y >= top) {
                    var idx = (w * y + x) << 2;
                    var idxW = (pixW * (y - top) + (x - left)) << 2;
                    if (idxW > -1) {
                        transPixels[idx] = pix[idxW];//red
                        transPixels[idx + 1] = pix[idxW + 1];//green
                        transPixels[idx + 2] = pix[idxW + 2];//blue
                        transPixels[idx + 3] = pix[idxW + 3];
                    }
                }
            }
        }
        return transPixels;
    }

    __parseImageData(PSD) {
        var _ = PSD;

        var imageData = _.imageData = {
                width: 0,
                height: 0,
                toImageData: null,
                saveAsPng: null,
            },//todo refactor to class
            file = _.file;

        var parsed = false, pos = file.now();

        imageData.width = _.header.width;
        imageData.height = _.header.height;


        imageData.toImageData = function () {
            if (parsed) return;

            file.tell(pos);
            var self = this;
            var compression = file.readShort();

            self.channelInfo = imageFun.PSDFormat[compression](_);
            self.pixelData = imageFun.mergeImageData(this, _.header.colorMode);
            parsed = true;
        };

        imageData.saveAsPng = function (output) {
            var self = this;
            self.toImageData();
            var png = new PNG({
                width: self.width,
                height: self.height,
                filterType: 4
            });
            if (self.pixelData) {
                png.data = self.pixelData;
                png.pack().pipe(fs.createWriteStream(output));
            } else {
                throw 'pixelData not exist'
            }
        };
    }
}