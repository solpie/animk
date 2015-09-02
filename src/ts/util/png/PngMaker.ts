/// <reference path="Packer.ts"/>

class PngMaker {

    createPng(w, h) {
        //this.readPng();
        //this.packPng(w, h);
        this.createPngData(w, h);
        return;
        var fs = require('fs'),
            PNG = require('png-coder').PNG;

        var png = new PNG({
            width: w,
            height: h,
            filterType: 0
        });
        //
        png.data = new Buffer(w * h * 4);
        png.depthInBytes = 1;
        console.log(this, "create", png.depthInBytes, png.data.length);
        for (var y = 0; y < png.height; y++) {
            for (var x = 0; x < png.width; x++) {
                var idx = (png.width * y + x) << 2;

                //var col = x < (png.width >> 1) ^ y < (png.height >> 1) ? 0xe5 : 0xff;
                // invert color
                // invert color
                png.data[idx] = 0;
                png.data[idx + 1] = 0;
                png.data[idx + 2] = 0;

                // and reduce opacity
                png.data[idx + 3] = 0;
            }
        }

        png.pack().pipe(fs.createWriteStream('test.png'));
    }

    createPngData(w, h) {
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

                //var col = x < (png.width >> 1) ^ y < (png.height >> 1) ? 0xe5 : 0xff;
                // invert color
                // invert color
                pixeldata[idx] = 0;
                pixeldata[idx + 1] = 0;
                pixeldata[idx + 2] = 0;

                // and reduce opacity
                pixeldata[idx + 3] = 0;
            }
        }
        var buffers = [];
        packer.on('data', function (buffer) {
            buffers.push(buffer);
            console.log(this, 'push buffer');
        });
        packer.on('end', ()=> {
            var buffer = Buffer.concat(buffers);
            var stream = fs.createWriteStream('../test/test.png');
            stream.write(buffer);
            stream.close();
        });
        //packer.on('error', dataStream.emit.bind(dataStream, 'error'));
        packer.pack(pixeldata, w, h, 1);
    }

}