/// <reference path="BaseView.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="TrackView.ts"/>
/// <reference path="../model/CompositionInfo.ts"/>

class CompositionView implements IBaseView {
    trackViewArr:Array<TrackView>;
    compInfo:CompositionInfo;

    constructor(compInfo:CompositionInfo) {
        this.compInfo = compInfo;
        compInfo.add("delTrack", this.delTrack);
        this.trackViewArr = [];
    }

    render():void {

    }

    newTrack() {
        //this.trackArr.push(trackInfo);
        var view = new TrackView(this.trackViewArr.length);
        this.trackViewArr.push(view);
        $("#composition").append(view.render());
    }

    delTrack() {
        console.log("test view");
    }

}