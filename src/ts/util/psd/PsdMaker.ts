/// <reference path="PsdFile.ts"/>
/// <reference path="PsdImage.ts"/>
/// <reference path="../psd2png/PsdParser.ts"/>


class PsdMaker {
    constructor() {
        this.compPngArr2PSD([]);
        //this.psd2png();
    }


    psd2png() {
        var psdParser = new PsdParser();
        var psd = psdParser.parse("../test/test2.psd");
        //psd.getDescendants();
        //psd.getTree();
        psd.getDescendants()[0].saveAsPng('../test/psd2png2.png');
        return;
    }

    compPngArr2PSD(pngArr:Array<string>) {
        var pngFilePath = "../test/test10/image001.png";
        pngArr.push(pngFilePath);
        pngArr.push("../test/test30/01.png");
        var PNG = require('pngjs').PNG;
        //var self = this;
        var pngDataArr = [];
        var whileLength = ()=> {
            var pngPath = pngArr.pop();
            if (pngPath) {
                fs.createReadStream(pngPath)
                    .pipe(new PNG({
                        filterType: 4
                    }))
                    .on('parsed', function (data) {
                        //this is PNG
                        var image = this;
                        image.pixels = image.data;
                        image.colorSpace = 'rgba';
                        pngDataArr.push(image);
                        whileLength();
                    });
            }
            else {
                console.log(this, "png layer length", pngDataArr.length);
                this.convertPNGs2PSD(pngDataArr, 1280, 720, 'rgba', function (psdFileBuffer) {
                    fs.writeFile("out.psd", psdFileBuffer, function (err) {
                        if (err) throw err;
                    });
                });
            }
        };
        whileLength();
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
        var pngLayer;
        for (var i = 0; i < png.length; i++) {
            pngLayer = png[i];
            var image = new PsdImage(pngLayer.width, pngLayer.height,
                colorSpace, new jDataView(pngLayer.pixels));
            var layer = new Layer();
            layer.drawImage(image);
            psd.appendLayer(layer);
        }


        // create merged image data
        psd.imageData = new PsdImage(pngLayer.width, pngLayer.height,
            pngLayer.colorSpace, new jDataView(pngLayer.pixels));

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