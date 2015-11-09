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
    basename;

    constructor(filename?) {
        this.filename = filename;
        this.img = new Image();
        this.basename = M_path.basename(filename);
        this.path = filename.replace(this.basename, "");
    }

    reloadImg(count?) {
        if (this.filename) {
            //todo load ref track in PNG buffer
            if (count)
                this.updateCount = count;
            this.updateCount++;
            this.img.src = this.filename + "?c=" + this.updateCount;
        }
    }
}