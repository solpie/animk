interface Image {
    src:string;
    width:number;
    height:number;
    onload:any;
}
class ImageInfo {
    _id;
    path;
    filename;
    width;
    height;
    img:Image;
    updateCount:number = 0;

    constructor(filename?) {
        this.filename = filename;
        this.img = new Image();
    }

    reloadImg() {
        if (this.filename) {
            //todo load in PNG buffer
            this.updateCount++;
            this.img.src = this.filename + "?c=" + this.updateCount;
        }
    }
}