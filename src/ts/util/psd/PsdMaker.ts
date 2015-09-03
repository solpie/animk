/// <reference path="PsdFile.ts"/>
/// <reference path="PsdImage.ts"/>


var PNGDecoder = require('png-stream').Decoder;
var concat = require('concat-frames');

class PsdMaker {
    constructor() {
        //var pngFilePath = "../test/test.png";
        //var psdFilePath = "../test/test2.psd";
        //fs.createReadStream(pngFilePath)
        //    .pipe(new PNGDecoder())
        //    .pipe(concat((frames)=> {
        //        console.log(this, frames);
        //        var image = frames[0];
        //        this.convertPNG2PSD(image, function (psdFileBuffer) {
        //            //callback(psdFileBuffer);
        //            fs.writeFile(psdFilePath, psdFileBuffer, function(err) {
        //                if (err) throw err;
        //            });
        //        });
        //    }));
        this.psd2png();
    }
    psd2png() {
        var PSD = require('psd-parser');
        var psd = PSD.parse('../test/test2.psd');
        console.log(psd)
        psd.getDescendants() //扁平化的图层数组
        psd.getTree() //树型结构的图层数组，与psd中结构相符
        console.log(psd._psd_) //解析psd后的原始对象

        //psd缩略图的输出,只支持png输出
        //psd.saveAsPng('test.png') //目前要注意目录是否存在
        //某个图层的png输出
        psd.getDescendants()[0].saveAsPng('../test/psd2png2.png')
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

        layer = new Layer();
        layer.drawImage(image);
        psd.appendLayer(layer);

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