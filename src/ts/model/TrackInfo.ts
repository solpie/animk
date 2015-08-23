/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="ImageInfo.ts"/>
class TrackInfo extends EventDispatcher {
    idx:number;
    name:string;
    isRomve:boolean;
    _imgArr:Array<string>;
    isSelected:boolean;
    _startFrame:number = 1;
    imgInfoArr:Array<ImageInfo>;

    constructor() {
        super();
        this.imgInfoArr = [];
    }

    setStartFrame(val) {
        this._startFrame = val;
    }

    getStartFrame() {
        return this._startFrame;
    }

    newImage(imgs:Array<string>) {
        for (var i in imgs) {
            this.imgInfoArr.push(new ImageInfo(imgs[i]))
        }
        this._imgArr = imgs;
    }

    getImgs() {
        return this._imgArr;
    }
}