/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="ImageInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
class TrackInfo extends EventDispatcher {
    idx:number;
    name:string;
    isRomve:boolean;
    _imgArr:Array<string>;
    isSelected:boolean;
    _start:number = 1;
    _end:number = 1;
    frameInfoArr:Array<FrameInfo>;

    constructor() {
        super();
        this.frameInfoArr = [];
    }

    setStart(val) {
        this._start = val;
    }

    getStart() {
        return this._start;
    }

    newImage(imgs:Array<string>) {
        var newFrame;
        for (var i = 0; i < imgs.length; i++) {
            newFrame = new FrameInfo(imgs[i]);
            newFrame.setStart(i + 1);
            newFrame.setIdx(this.frameInfoArr.length);
            this.frameInfoArr.push(newFrame);
        }
        this._imgArr = imgs;
        this._end = imgs.length;
    }

    getImgs() {
        return this._imgArr;
    }

    getIdxArr() {
        var a = [];
        for (var i = 0; i < this._imgArr.length; i++) {
            a.push(ElmClass$.TrackCls + this.idx + ElmClass$.Frame + (i + 1));
        }
        return a;
    }

    getEnd() {
        return this._end;
    }

    getFrameInfo(mouseX) {
        var idxX = Math.ceil(mouseX / appInfo.projectInfo.curComp.frameWidth);
        var nextFrame;
        for (var i = idxX - 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            if (nextFrame && nextFrame.getStart() <= idxX && nextFrame.getEnd() >= idxX) {
                return nextFrame;
            }
            else {
                console.log(this, "?Frame", nextFrame.getStart(), nextFrame.getEnd());
            }
        }
    }

    R2R(handleFrame:FrameInfo) {
        handleFrame.setHold(handleFrame.getHold() + 1);
        console.log(this, "R2R pick idx:", handleFrame.getIdx(), "hold:", handleFrame.getHold());
        var nextFrame;
        for (var i = handleFrame.getIdx() + 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            nextFrame.setStart(nextFrame.getStart() + 1);
            console.log(this, "R2R idx:", nextFrame.getIdx(), "start:", nextFrame.getStart())
        }
        //todo updateContentEndFrame
    }
}