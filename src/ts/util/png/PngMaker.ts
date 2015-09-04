/// <reference path="Packer.ts"/>
/// <reference path="../../Node.ts"/>
/// <reference path="../psd/PsdMaker.ts"/>

class PngMaker {

    createPng(w, h) {
        var packer = new Packer({
            width: w,
            depthInBytes: 1,
            filterType: 0,
            height: h
        });
        var pixeldata = new Buffer(w * h * 4);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var idx = (w * y + x) << 2;

                pixeldata[idx] = 0;//red
                pixeldata[idx + 1] = 0;//green
                pixeldata[idx + 2] = 0;//blue
                // opacity
                pixeldata[idx + 3] = 0;
            }
        }
        packer.pack(pixeldata, w, h, 1,'../test/test2.png');
        var psd = new PsdMaker();
    }

}