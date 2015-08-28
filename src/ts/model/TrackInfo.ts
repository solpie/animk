/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../view/ViewId.ts"/>
/// <reference path="ImageInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
enum TrackLoopType{
    NONE, HOLD, REPEAT
}
enum TrackType{
    IMAGE = 1,
    COMP,
    AUDIO,
}
class TrackInfo extends EventDispatcher {
    idx:number;
    name:string;
    type:number;
    isRomve:boolean;
    _imgArr:Array<string>;
    isSelected:boolean;
    _start:number = 1;
    _hold:number = 1;
    _loopType = TrackLoopType.HOLD;
    frameInfoArr:Array<FrameInfo>;
    removedFrameArr:Array<FrameInfo>;
    opacity:number;
    enable:boolean;

    constructor() {
        super();
        this.frameInfoArr = [];
        this.removedFrameArr = [];
        this.opacity = 1;
        this.enable = true;
    }

    setStart(val) {
        this._start = val;
        this.dis(TrackInfoEvent.UPDATE_TRACK_START, this)
    }

    getStart() {
        return this._start;
    }

    _loadCount;

    newImage(imgs:Array<string>) {
        var newFrame;
        this._loadCount = imgs.length;
        for (var i = 0; i < imgs.length; i++) {
            newFrame = new FrameInfo(imgs[i]);
            //todo delete img listener
            newFrame.imageInfo.img.addEventListener("load", ()=> {
                this.onImgLoaded();
            });
            newFrame.setStart(i + 1);
            newFrame.setIdx(this.frameInfoArr.length);
            this.frameInfoArr.push(newFrame);
        }
        this._imgArr = imgs;
        this._hold = imgs.length;
    }

    onImgLoaded() {
        //console.log(this, "load test");
        //img.removeEventListener("load", this._onLoadFunc);
        this._loadCount--;
        if (this._loadCount > 0) {
        }
        else {
            this.dis(TrackInfoEvent.LOADED);
        }
    }

    getCurImg(frameIdx:number):Image {
        frameIdx -= this._start - 1;
        for (var i = 0; i < this.frameInfoArr.length; i++) {
            var frameInfo:FrameInfo = this.frameInfoArr[i];
            if (frameInfo.getStart() <= frameIdx && frameInfo.getEnd() >= frameIdx) {
                return frameInfo.imageInfo.img;
            }
        }
        if (frameIdx > frameInfo.getEnd() && this._loopType == TrackLoopType.HOLD) {
            return frameInfo.imageInfo.img;
        }
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

    getHold() {
        return this._hold;
    }

    getEnd() {
        return this._start + this._hold - 1;
    }

    getFrameInfo(mouseX) {
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        //var idxX = Math.ceil(mouseX / appInfo.projectInfo.curComp.frameWidth);
        var pickFrame;
        for (var i = 0; i < this.frameInfoArr.length; ++i) {
            pickFrame = this.frameInfoArr[i];
            var startX = (pickFrame.getStart() - 1) * frameWidth;
            var endX = (pickFrame.getEnd()) * frameWidth;
            if (pickFrame && startX <= mouseX
                && endX >= mouseX) {
                var frameX = mouseX - startX;
                if (frameX < (endX - startX) / 2) {
                    pickFrame.pressFlag = PressFlag.L;
                }
                else {
                    pickFrame.pressFlag = PressFlag.R;
                }
                return pickFrame;
            }
            else {
                //console.log(this, "?Frame", nextFrame.getStart(), nextFrame.getHold());
            }
        }
    }

    R2R(pickFrame:FrameInfo) {
        pickFrame.setHold(pickFrame.getHold() + 1);
        console.log(this, "R2R pick idx:", pickFrame.getIdx(), "hold:", pickFrame.getHold());
        var nextFrame;
        for (var i = pickFrame.getIdx() + 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            nextFrame.setStart(nextFrame.getStart() + 1);
            console.log(this, "R2R idx:", nextFrame.getIdx(), "start:", nextFrame.getStart())
        }
        this._hold++;
        this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
    }

    R2L(pickFrame:FrameInfo) {
        pickFrame.setHold(pickFrame.getHold() - 1);
        var nextFrame;
        for (var i = pickFrame.getIdx() + 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            nextFrame.setStart(nextFrame.getStart() - 1);
        }
        this._hold--;
        this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
    }

    L2L(pickFrame:FrameInfo) {
        if (pickFrame.getIdx() > 0) {
            var preFrame = this.frameInfoArr[pickFrame.getIdx() - 1];
            var preHold = preFrame.getHold();
            if (preHold > 1) {
                preFrame.setHold(preFrame.getHold() - 1);
            }
            else
                this.removeFrame(preFrame);
        }
        pickFrame.setStart(pickFrame.getStart() - 1);
        pickFrame.setHold(pickFrame.getHold() + 1);
        this.dis(TrackInfoEvent.UPDATE_START, pickFrame);
    }

    clearRemoveFrame() {
        this.removedFrameArr.length = 0;
    }

    L2R(pickFrame:FrameInfo) {
        if (this.removedFrameArr.length) {
            var delFrame:FrameInfo = this.removedFrameArr.pop();
            //this.frameInfoArr
            for (var i = delFrame.getIdx(); i < this.frameInfoArr.length; i++) {
                var frameInfo:FrameInfo = this.frameInfoArr[i];
                frameInfo.dtIdx(1);
            }
            this.frameInfoArr.splice(delFrame.getIdx(), 0, delFrame);
        }
        else {
            if (pickFrame.getIdx() > 0) {
                this.frameInfoArr[pickFrame.getIdx() - 1].dtHold(1);
            }
        }
        if (pickFrame.getHold() > 1) {
            pickFrame.dtStart(1);
            pickFrame.dtHold(-1);
        }
        else {
            this.removeFrame(pickFrame)
        }
        this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);


        //    updateContentEndFrame();
        //    dumpTrackFrameIdx(trackInfo);
    }


    removeFrame(frame:FrameInfo) {
        console.log(this, "removeFrame idx", frame.getIdx(), 'len:', this.frameInfoArr.length);
        var removeIdx = frame.getIdx();
        this.removedFrameArr.push(frame);
        this.frameInfoArr.splice(removeIdx, 1);
        console.log(this, "removeFrame length", this.frameInfoArr.length);
        for (var i = removeIdx; i < this.frameInfoArr.length; i++) {
            var frameBack = this.frameInfoArr[i];
            frameBack.dtIdx(-1);
        }
        this.dis(TrackInfoEvent.DEL_FRAME, frame);
    }
}