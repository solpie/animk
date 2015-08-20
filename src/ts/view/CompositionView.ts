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
        this.trackViewArr = [];
        var self = this;
        this.compInfo.add("newTrack",function(trackInfo:TrackInfo){
           self.newTrackView(trackInfo);
        });
        this.compInfo.add("delTrack",function(idx:number){
           self.onDelTrackView(idx);
        });
        this.trackViewArr = [];
    }

    render():void {

    }

    newTrackView(trackInfo:TrackInfo) {
        //this.trackInfoArr.push(trackInfo);
        console.log(this,"newTrackView");

        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        $("#composition").append(view.render());
    }

    onDelTrackView(idx:number) {
        console.log(this,"onDelTrackView",idx);

        //this.trackInfoArr.splice(idx, 1);
        //delete this.trackInfoArr[idx];
        this.trackViewArr[idx].remove();
        delete this.trackViewArr[idx];
        //this.trackViewArr.splice(idx, 1);
    }

}