interface Image {
    src:string;
    onload:any;
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
        this.img = new Image();
    }

    reloadImg() {
        if (this.filename) {
            this.updateCount++;
            this.img.src = this.filename+"?c="+this.updateCount;
        }
    }
}