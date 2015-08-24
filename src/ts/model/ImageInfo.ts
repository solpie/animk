class ImageInfo {
    _id;
    path;
    filename;
    width;
    height;
    img:Image;
    constructor(filename?) {
        this.filename = filename;
        this.img = new Image();
        this.img.src = filename;
    }
}