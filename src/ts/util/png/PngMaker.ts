/// <reference path="Packer.ts"/>
/// <reference path="../../Node.ts"/>
/// <reference path="../psd/PsdMaker.ts"/>

class PngMaker {

    createPng(w, h, path, callback) {
        var packer = new Packer({
            width: w,
            depthInBytes: 1,
            filterType: 0,
            height: h
        });
        var pixelData = new Buffer(w * h * 4);
        pixelData.fill(0);
        //for (var y = 0; y < h; y++) {
        //    for (var x = 0; x < w; x++) {
        //        var idx = (w * y + x) << 2;
        //
        //        pixelData[idx] = 0;//red
        //        pixelData[idx + 1] = 0;//green
        //        pixelData[idx + 2] = 0;//blue
        //        // opacity
        //        pixelData[idx + 3] = 0;
        //    }
        //}

        packer.pack(pixelData, w, h, 1, path, callback);
    }

    transPng(w, h, path, callback) {
        var packer = new Packer({
            width: w,
            depthInBytes: 1,
            filterType: 0,
            height: h
        });

        var pixelData = new Buffer(w * h * 4);
        pixelData.fill(0);

        var left = 20;
        var top = 30;
        var WhiteData = new Buffer(30 * 20 * 4);
        WhiteData.fill(255);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                if (x >= left && y >= top) {
                    var idx = (w * y + x) << 2;
                    var idxW = (30 * (y - top) + (x - left)) << 2;
                    if (idxW > -1) {
                        if (idxW == 0)
                            console.log(this, "x", x, "y", y);
                        pixelData[idx] = WhiteData[idxW];//red
                        pixelData[idx + 1] = WhiteData[idxW + 1];//green
                        pixelData[idx + 2] = WhiteData[idxW + 2];//blue
                        // opacity
                        pixelData[idx + 3] = WhiteData[idxW + 3];
                    }

                }

            }
        }

        packer.pack(pixelData, w, h, 1, path, callback);
    }

    static transPixels(pixW, pixH, pix, left, top) {
        var w = pixW + left;
        var h = pixH + top;
        var transPixels = new Buffer((w ) * (h ) * 4);
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

}