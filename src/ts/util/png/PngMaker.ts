/// <reference path="Packer.ts"/>
/// <reference path="../../Node.ts"/>
/// <reference path="../psd/PsdMaker.ts"/>

class PngMaker {

    createPng(w, h, path,callback) {
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

        packer.pack(pixelData, w, h, 1, path,callback);
    }

}