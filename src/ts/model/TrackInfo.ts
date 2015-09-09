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
enum ImageTrackActType{
    NORMAL = 1,//in psd ,render
    REF,// in psd ,no render
    NOEDIT,//not in psd in psd but render
}
class TrackData {//for save
    name:string;
    opacity:number = 1;
    enable:boolean = true;
    type:number = TrackType.IMAGE;
    start:number = 1;
    act:number = ImageTrackActType.NORMAL;
    loopType:number = TrackLoopType.HOLD;
    end:number = 1;
    path:string;
    frames:Array<FrameData>;

    static clone(val:TrackData) {
        var td = new TrackData();
        for (var p in val) {
            if (p != "frames")
                td[p] = val[p];
            else {
                //console.log(this, "no clone for Array");
            }
        }
        td.frames = [];
        for (var i = 0; i < val.frames.length; i++) {
            td.frames.push(FrameData.clone(val.frames[i]))
        }
        return td;
    }
}
class TrackInfo extends EventDispatcher {
    _idx:number;
    frameInfoArr:Array<FrameInfo>;
    _trackData:TrackData;
    isSelected:boolean;
    _hold:number = 1;
    _isSel:Boolean = false;
    removedFrameArr:Array<FrameInfo>;
    _layerIdx:number;

    constructor(trackData:TrackData) {
        super();
        this._trackData = trackData;
        this.frameInfoArr = [];
        this.removedFrameArr = [];
    }

    idx2(val?) {
        if (isdef(val)) {
            this._idx = val;
        }
        else
            return this._idx;
    }

    layerIdx(v?) {
        return prop(this, "_layerIdx", v);
    }

    isSel(v?) {
        return prop(this, "_isSel", v, ()=> {
            this.emit(TrackInfoEvent.SEL_TRACK)
        })
    }

    name(val?) {
        if (isdef(val)) {
            this._trackData.name = val;
            this.emit(TrackInfoEvent.SET_NAME, val);
        }
        else
            return this._trackData.name;
    }

    loopType(val?) {
        if (isdef(val)) {
            this._trackData.loopType = val;
        }
        else
            return this._trackData.loopType;
    }


    opacity(val?) {
        if (isdef(val)) {
            this._trackData.opacity = val;
            this.emit(TrackInfoEvent.SET_OPACITY);
        }
        else
            return this._trackData.opacity;
    }

    enable(val?) {
        if (isdef(val)) {
            this._trackData.enable = val;
            this.emit(TrackInfoEvent.SET_ENABLE);
            appInfo.emit(TheMachineEvent.UPDATE_IMG)
        }
        else
            return this._trackData.enable;
    }

    actType(val?) {
        return prop(this._trackData, "act", val, ()=> {
            this.emit(TrackInfoEvent.SET_ACT_TYPE, val)
        });
    }

    path(val?) {
        if (isdef(val)) {
            this._trackData.path = val;
        }
        else
            return this._trackData.path;
    }

    start(v?) {
        return prop(this._trackData, "start", v, ()=> {
            this.emit(TrackInfoEvent.UPDATE_TRACK_START, this)
        });
    }

    trackData():TrackData {
        return this._trackData;
    }

    _loadCount;

    newImage(frameDataArr:Array<FrameData>) {
        var newFrame;
        var frameData:FrameData;
        this._loadCount = frameDataArr.length;
        var holdCount = frameDataArr.length;
        for (var i = 0; i < frameDataArr.length; i++) {
            frameData = frameDataArr[i];
            newFrame = new FrameInfo(frameData.filename);
            //todo delete img listener
            newFrame.imageInfo.img.addEventListener("load", ()=> {
                this.onImgLoaded();
            });
            if (frameData.start) {
                newFrame.setStart(frameData.start);
                newFrame.setHold(frameData.hold);
                holdCount += (frameData.hold - 1);
            }
            else {
                newFrame.setStart(i + 1);
                newFrame.setHold(1);
            }
            newFrame.setIdx(this.frameInfoArr.length);
            this.frameInfoArr.push(newFrame);
        }
        this._hold = holdCount;
    }

    onImgLoaded() {
        //console.log(this, "load test");
        //img.removeEventListener("load", this._onLoadFunc);
        this._loadCount--;
        if (this._loadCount > 0) {
        }
        else {
            this.emit(TrackInfoEvent.LOADED);
        }
    }

    getCurImg(frameIdx:number):ImageInfo {
        frameIdx -= this.start() - 1;
        for (var i = 0; i < this.frameInfoArr.length; i++) {
            var frameInfo:FrameInfo = this.frameInfoArr[i];
            if (frameInfo.getStart() <= frameIdx && frameInfo.getEnd() >= frameIdx) {
                return frameInfo.imageInfo;
            }
        }
        if (frameIdx > frameInfo.getEnd() && this.loopType() == TrackLoopType.HOLD) {
            return frameInfo.imageInfo;
        }
        return null;
    }


    getIdxArr() {
        var a = [];
        for (var i = 0; i < this.frameInfoArr.length; i++) {
            a.push(ElmClass$.TrackCls + this.idx2() + ElmClass$.Frame + (i + 1));
        }
        return a;
    }

    getHold() {
        return this._hold;
    }

    getEnd() {
        return this.start() + this._hold - 1;
    }

    getPickFrameInfo(mouseX) {
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
            }
        }
        //console.log(this, "?Frame");
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
        //this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
    }

    R2L(pickFrame:FrameInfo) {
        pickFrame.setHold(pickFrame.getHold() - 1);
        var nextFrame;
        for (var i = pickFrame.getIdx() + 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            nextFrame.setStart(nextFrame.getStart() - 1);
        }
        this._hold--;
        //this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
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
    }

    clearRemoveFrame() {
        this.removedFrameArr.length = 0;
    }

    L2R(pickFrame:FrameInfo) {
        //fixme
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
        //this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);


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
        this.emit(TrackInfoEvent.DEL_FRAME, frame);
    }

}