var PNG = require('pngjs').PNG;
class ImageLayerInfo { //glue ImageInfo and PsdLayer
    width:number;
    height:number;
    opacity:number;
    isRef:boolean;
    pixels:Buffer;
    filename:string;
    imageInfo:ImageInfo;
    constructor() {
        //console.log(this, "new PngLayerData");
    }

    load(callback) {
        var self = this;
        if (this.filename)
            fs.createReadStream(this.filename)
                .pipe(new PNG({
                    filterType: 4
                }))
                .on('parsed', function (data) {
                    //this is PNG
                    self.pixels = this.data;
                    self.width = this.width;
                    self.height = this.height;
                    //console.log(this, "parsed", data, this.data);
                    callback();
                });
    }

    static png2psd(pngArr:Array<ImageLayerInfo>, w, h, colorSpace, path:string, pathCallback) {
        // create psd data
        var psd = new PsdFile(w, h, colorSpace);

        // append layer
        var pngLayer:ImageLayerInfo;
        for (var i = 0; i < pngArr.length; i++) {
            pngLayer = pngArr[i];
            var image = new PsdImage(pngLayer.width, pngLayer.height,
                colorSpace, pngLayer.pixels);
            var layer = new Layer();
            layer.drawImage(image);
            layer.opacity = pngLayer.opacity;
            psd.appendLayer(layer);
        }

        // create merged image data
        var b = new Buffer(4);
        psd.imageData = new PsdImage(1, 1,
            colorSpace, b);

        fs.writeFile(path, psd.toBinary(), (err) => {
            if (err) throw err;
            pathCallback(path);
        });
    }
}