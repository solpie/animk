/// <reference path="PsdFile.ts"/>
/// <reference path="PsdImage.ts"/>
/// <reference path="../psd2png/PsdParser.ts"/>
var PNG = require('pngjs').PNG;

class PsdMaker {
    constructor() {
        //this.compPngArr2PSD([]);
        //this.psd2png();
    }


    psd2png() {
        var psdParser = new PsdParser();
        var psd = psdParser.parse("../test/comp.psd");
        //psd.getDescendants();
        //psd.getTree();
        psd.getDescendants()[0].saveAsPng('../test/psd2png2.png');
        console.log(this, "psd2png");
        //return;
    }


    //static convertPNGs2PSD(pngArr:Array<PngLayerData>, w, h, colorSpace, path:string, pathCallback) {
    //    // create psd data
    //    var psd = new PsdFile(w, h, colorSpace);
    //
    //    // append layer
    //    var pngLayer:PngLayerData;
    //    for (var i = 0; i < pngArr.length; i++) {
    //        pngLayer = pngArr[i];
    //        var image = new PsdImage(pngLayer.width, pngLayer.height,
    //            colorSpace, pngLayer.pixels);
    //        var layer = new Layer();
    //        layer.drawImage(image);
    //        layer.opacity = pngLayer.opacity;
    //        psd.appendLayer(layer);
    //    }
    //
    //    // create merged image data
    //    var b = new Buffer(4);
    //    psd.imageData = new PsdImage(1, 1,
    //        colorSpace, b);
    //
    //    //psd.imageData = new PsdImage(pngLayer.width, pngLayer.height,
    //    //    pngLayer.colorSpace, new jDataView(pngLayer.pixels));
    //
    //    // alpha blend whth white background
    //    if (psd.hasAlpha) {
    //        //var channels = psd.imageData.channels;
    //        //var alphaPixels = channels[channels.length - 1].pixels;
    //        //for (var i = 0, l = channels.length - 1; i < l; i++) {
    //        //    var pixels = channels[i].pixels;
    //        //    for (var index = 0; index < pixels.byteLength; index++) {
    //        //        var color = pixels.getUint8(index);
    //        //        var alpha = alphaPixels.getUint8(index);
    //        //        var blendedColor = this.alphaBlendWithWhite(color, alpha);
    //        //        pixels.setUint8(index, blendedColor);
    //        //    }
    //        //}
    //    }
    //
    //
    //    fs.writeFile(path, psd.
    //        toBinary(), function (err) {
    //        if (err) throw err;
    //        pathCallback(path);
    //        //console.log(this, "sus", new Date().getTime() - startTime);
    //    });
    //    //callback(psd.toBinary());
    //}

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