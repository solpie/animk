/// <reference path="../event/EventDispatcher.ts"/>
class TrackInfo extends EventDispatcher {
    idx:number;
    name:string;
    isRomve:boolean;
    imgArr:Array<string>;
    isSelected:boolean;
    _startFrame:number = 1;


    setStartFrame(val) {
        this._startFrame = val;
    }

    getStartFrame() {
        return this._startFrame;
    }
}