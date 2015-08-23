/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="ImageInfo.ts"/>
class FrameInfo extends EventDispatcher {

    _idx = -1;
    _start = 1;
    _end = 1;
    _hold = 1;
    imageInfo:ImageInfo;

    constructor() {
        super();
    }

    getIdx() {
        return this._idx;
    }

    setIdx(v) {
        this._idx = v;
    }

    getStart() {
        return this._start;
    }

    setStart(v) {
        this._start = v;
        this._end = v + this._hold - 1;
    }

    getHold() {
        return this._hold;
    }

    setHold(v) {
        this._hold = v;
        this._end = this._start + this._hold - 1;
    }

    getEnd() {
        return this._end;
    }
}