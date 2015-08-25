interface Image {
    src:string;
}
class ImageInfo {
    _id;
    path;
    filename;
    width;
    height;
    img:Image;
    updateCount:number=0;

    constructor(filename?) {
        this.filename = filename;
        this.updateImg();
    }

    updateImg() {
        if (this.filename) {
            this.updateCount++;
            this.img = new Image();
            this.img.src = this.filename+"?c="+this.updateCount;
        }
    }
}