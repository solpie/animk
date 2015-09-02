/// <reference path="Packer.ts"/>

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