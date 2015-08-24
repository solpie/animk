/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="ImageInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
class TrackInfo extends EventDispatcher {
    idx:number;
    name:string;
    isRomve:boolean;
    _imgArr:Array<string>;
    isSelected:boolean;
    _start:number = 1;
    _hold:number = 1;
    frameInfoArr:Array<FrameInfo>;

    constructor() {
        super();
        this.frameInfoArr = [];
    }

    setStart(val) {
        this._start = val;
        this.dis(TrackInfoEvent.UPDATE_TRACK_START, this)
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
        this._hold = imgs.length;
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
        return this._hold ;
    }
    getEnd()
    {
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
        //if (handleTrackFrame->pre) {
        //    int preHoldFrame = handleTrackFrame->pre->getHoldFrame();
        //    if (preHoldFrame > 1)
        //            handleTrackFrame->pre->setHoldFrame(handleTrackFrame->pre->getHoldFrame() - 1);
        //    else
        //        removeTrackFrameInfo(handleTrackFrame->pre, trackInfo);
        //}
        //    handleTrackFrame->setStartFrame(handleTrackFrame->getStartFrame() - 1);
        //    handleTrackFrame->setHoldFrame(handleTrackFrame->getHoldFrame() + 1);
        //
        //dumpTrackFrameIdx(trackInfo);
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

    L2R(pickFrame:FrameInfo) {

    }

    removeFrame(frame) {
    }
}