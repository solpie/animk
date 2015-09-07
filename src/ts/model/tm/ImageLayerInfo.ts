var PNG = require('pngjs').PNG;
class ImageLayerInfo { //glue ImageInfo and PsdLayer
    width:number;
    height:number;
    opacity:number;
    pixels:Buffer;
    filename:string;

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
}