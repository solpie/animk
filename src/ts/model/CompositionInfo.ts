/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="TrackInfo.ts"/>
/// <reference path="../view/TrackView.ts"/>
/// <reference path="../Node.ts"/>

class CompositionInfo extends EventDispatcher {
    trackInfoArr:Array<TrackInfo>;

    constructor() {
        super();
        this.trackInfoArr = [];
        console.log("new CompInfo");
    }

    newTrack(path) {
        var trackInfo = new TrackInfo();
        trackInfo.imgArr = walk(path);
        trackInfo.idx = this.trackInfoArr.length;
        trackInfo.name = 'track#' + trackInfo.idx;
        this.trackInfoArr.push(trackInfo);
        this.dis(ActEvent.NEW_TRACK, trackInfo);
        console.log(this, "newTrack idx", trackInfo.idx);
    }


    delSelTrack() {
        var trackInfo:TrackInfo;
        for (var i in this.trackInfoArr) {
            trackInfo = this.trackInfoArr[i];
            if(trackInfo.isSelected)
            {
                this.delTrack(trackInfo.idx);
                break;
            }
        }
    }

    delTrack(idx:number) {
        //this.trackInfoArr.splice(idx, 1);
        delete this.trackInfoArr[idx];
        console.log(this, "delTrack", idx + '');
        this.dis(ActEvent.DEL_TRACK, idx);
        //this.trackViewArr.splice(idx, 1);
    }
}