/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="TrackInfo.ts"/>
/// <reference path="../view/TrackView.ts"/>
/// <reference path="../NodeJS.ts"/>

class CompositionInfo extends EventDispatcher {
    trackInfoArr:Array<TrackInfo>;

    constructor() {
        super();
        this.trackInfoArr = [];
        console.log("new CompInfo");
    }

    newTrack(path) {
        walk(path);
        var info = new TrackInfo();
        info.idx = this.trackInfoArr.length;
        this.trackInfoArr.push(info);
        this.dis(ActEvent.NEW_TRACK, info);
        console.log(this, "newTrack idx", info.idx);
    }

    delTrack(idx:number) {
        //this.trackInfoArr.splice(idx, 1);
        delete this.trackInfoArr[idx];
        console.log(this, "delTrack", idx+'');
        this.dis(ActEvent.DEL_TRACK, idx);
        //this.trackViewArr.splice(idx, 1);
    }
}