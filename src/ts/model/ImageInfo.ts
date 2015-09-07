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

    opacity:number = 1;//for png output
    isRef:boolean;//for png update

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