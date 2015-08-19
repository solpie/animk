/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="TrackInfo.ts"/>
/// <reference path="../view/TrackView.ts"/>
class CompositionInfo extends EventDispatcher {
    trackArr:Array<TrackInfo>;
    trackViewArr:Array<TrackView>;

    constructor() {
        super();
        this.trackArr = [];
        this.trackViewArr = [];
        console.log("new CompInfo");
    }

    newTrack() {
        //this.trackArr.push(trackInfo);
        console.log(this,"newTrack");
        var view = new TrackView(this.trackViewArr.length);
        this.trackViewArr.push(view);
        $("#composition").append(view.render());
    }

    delTrack(idx:number) {
        //this.trackArr.splice(idx, 1);
        //delete this.trackArr[idx];
        this.dis("delTrack");
        console.log("delete trackInfo", this, this.getTrackInfoArr().length);
        this.trackViewArr[idx].remove();
        delete this.trackViewArr[idx];
        //this.trackViewArr.splice(idx, 1);
    }

    getTrackInfoArr():Array<TrackInfo> {
        var a = [];
        for (var i = 0; i < this.trackViewArr.length; ++i) {
            if (this.trackViewArr[i])
                a.push(this.trackViewArr[i].trackInfo);
        }
        return a;
    }
}