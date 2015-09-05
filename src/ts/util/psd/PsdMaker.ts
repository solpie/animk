/// <reference path="PsdFile.ts"/>
/// <reference path="PsdImage.ts"/>
/// <reference path="../psd2png/PsdParser.ts"/>


var PNGDecoder = require('png-stream').Decoder;
var concat = require('concat-frames');

class PsdMaker {
    constructor() {
        //this.png2psd();
        this.compPngArr2PSD([]);
        //this.psd2png();
    }

    png2psd() {
        var pngFilePath = "../test/test10/image001.png";
        var psdFilePath = "../test/test2.psd";
        fs.createReadStream(pngFilePath)
            .pipe(new PNGDecoder())
            .pipe(concat((frames)=> {
                var image = frames[0];
                console.log(this, image, image.pixels, image.colorSpace);
                this.convertPNG2PSD(image, function (psdFileBuffer) {
                    //callback(psdFileBuffer);
                    fs.writeFile(psdFilePath, psdFileBuffer, function (err) {
                        if (err) throw err;
                    });
                });
            }));
    }

    psd2png() {
        var psdParser = new PsdParser();
        var psd = psdParser.parse("../test/test2.psd");
        //psd.getDescendants();
        //psd.getTree();
        psd.getDescendants()[0].saveAsPng('../test/psd2png2.png');
        return;


        //var PSD = require('psd-parser');
        //var psd = PSD.parse('../test/test2.psd');
        ////console.log(psd);
        ////psd.getDescendants(); //��ƽ����ͼ������
        ////psd.getTree(); //���ͽṹ��ͼ�����飬��psd�нṹ���?
        ////console.log(psd._psd_); //����psd���ԭʼ����?
        //
        ////psd����ͼ�����?ֻ֧��png���?
        ////psd.saveAsPng('test.png') //ĿǰҪע��Ŀ¼�Ƿ����?
        ////ĳ��ͼ���png���?
        //psd.getDescendants()[0].saveAsPng('../test/psd2png2.png')
    }

    compPngArr2PSD(pngArr:Array<string>) {
        var pngFilePath = "../test/test10/image001.png";
        pngArr.push(pngFilePath);
        //pngArr.push("../test/test30/i01.png");
        var PNG = require('pngjs').PNG;
        var self = this;
        for (var i = 0; i < pngArr.length; i++) {
            var pngPath = pngArr[i];
            fs.createReadStream(pngPath)
                .pipe(new PNG({
                    filterType: 4
                }))
                .on('parsed', function (data) {
                    var image = this;
                    image.pixels = image.data;
                    image.colorSpace = 'rgba';
                    //console.log(this, data);
                    //for (var y = 0; y < this.height; y++) {
                    //    for (var x = 0; x < this.width; x++) {
                    //        var idx = (this.width * y + x) << 2;
                    //
                    //        // invert color
                    //        this.data[idx] = 255 - this.data[idx];
                    //        this.data[idx + 1] = 255 - this.data[idx + 1];
                    //        this.data[idx + 2] = 255 - this.data[idx + 2];
                    //
                    //        // and reduce opacity
                    //        this.data[idx + 3] = this.data[idx + 3] >> 1;
                    //    }
                    //}
                    self.convertPNG2PSD(image, function (psdFileBuffer) {
                        //callback(psdFileBuffer);
                        fs.writeFile("out.psd", psdFileBuffer, function (err) {
                            if (err) throw err;
                        });
                    });
                    //this.pack().pipe(fs.createWriteStream('out.png'));
                });
        }
    }

    /**
     * convertPNG2PSD
     * @param image {png} png image data
     * @param callback {function} function(psdBuffer)
     */
    convertPNG2PSD(png, callback) {
        // create psd data
        var psd = new PsdFile(png.width, png.height, png.colorSpace);

        // append layer
        var image = new PsdImage(png.width, png.height,
            png.colorSpace, new jDataView(png.pixels));
        var layer = new Layer();
        layer.drawImage(image);
        psd.appendLayer(layer);

        //layer = new Layer();
        //layer.drawImage(image);
        //psd.appendLayer(layer);

         //create merged image data
        psd.imageData = new PsdImage(png.width, png.height,
            png.colorSpace, new jDataView(png.pixels));

        // alpha blend whth white background
        if (psd.hasAlpha) {
            //var channels = psd.imageData.channels;
            //var alphaPixels = channels[channels.length - 1].pixels;
            //for (var i = 0, l = channels.length - 1; i < l; i++) {
            //    var pixels = channels[i].pixels;
            //    for (var index = 0; index < pixels.byteLength; index++) {
            //        var color = pixels.getUint8(index);
            //        var alpha = alphaPixels.getUint8(index);
            //        var blendedColor = this.alphaBlendWithWhite(color, alpha);
            //        pixels.setUint8(index, blendedColor);
            //    }
            //}
        }

        callback(psd.toBinary());
    }

    convertPNGs2PSD(png, w, h, colorSpace, callback) {
        // create psd data
        var psd = new PsdFile(w, h, colorSpace);

        // append layer
        for (var i = 0; i < png.length; i++) {
            var pngLayer = png[i];
            var image = new PsdImage(pngLayer.width, pngLayer.height,
                colorSpace, new jDataView(pngLayer.pixels));
            var layer = new Layer();
            layer.drawImage(image);
            psd.appendLayer(layer);
        }


        // create merged image data
        psd.imageData = new PsdImage(png.width, png.height,
            png.colorSpace, new jDataView(png.pixels));

        // alpha blend whth white background
        if (psd.hasAlpha) {
            var channels = psd.imageData.channels;
            var alphaPixels = channels[channels.length - 1].pixels;
            for (var i = 0, l = channels.length - 1; i < l; i++) {
                var pixels = channels[i].pixels;
                for (var index = 0; index < pixels.byteLength; index++) {
                    var color = pixels.getUint8(index);
                    var alpha = alphaPixels.getUint8(index);
                    var blendedColor = this.alphaBlendWithWhite(color, alpha);
                    pixels.setUint8(index, blendedColor);
                }
            }
        }

        callback(psd.toBinary());
    }

    /**
     * Alpha blend with white background
     * @param srcColor {number} source color (0-255)
     * @param srcAlpha {number} source alpha (0-255)
     * @return {number} alpha blended color (0-255)
     */
    alphaBlendWithWhite(srcColor, srcAlpha) {
        var MAX = 255,
            MIN = 0,
            ALPHA_MAX = 1,
            WHITE = 255;
        if (srcAlpha === MAX) return srcColor;
        if (srcAlpha === MIN) return MAX;

        var alpha = srcAlpha / MAX;
        return Math.round((srcColor * alpha) + (WHITE * (ALPHA_MAX - alpha)));
    }
}