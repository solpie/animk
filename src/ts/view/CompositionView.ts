/// <reference path="BaseView.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="TrackView.ts"/>
/// <reference path="../model/CompositionInfo.ts"/>

class CompositionView implements IBaseView {
    render():HTMLElement {
        return undefined;
    }
    trackViewArr:Array<TrackView>;

    compInfo:CompositionInfo;

    constructor(compInfo:CompositionInfo) {
        this.compInfo = compInfo;
        this.trackViewArr = [];
        var self = this;
        this.compInfo.add(ActEvent.NEW_TRACK, function (trackInfo:TrackInfo) {
            self.onNewTrackView(trackInfo);
        });
        this.compInfo.add(ActEvent.DEL_TRACK, function (idx:number) {
            self.onDelTrackView(idx);
        });
        this.trackViewArr = [];
    }

    onNewTrackView(trackInfo:TrackInfo) {
        //this.trackInfoArr.push(trackInfo);
        console.log(this, "onNewTrackView");

        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        //var trackEl = view.render(trackInfo.imgArr);
        view.setParent($("#composition"));
        //$("#composition").append(view.render());
        //view.$el = $(".Track#" + trackInfo.idx)[0];
        console.log('new TrackView',view.$el);

    }

    onDelTrackView(idx:number) {
        console.log(this, "onDelTrackView", idx + '');

        //this.trackInfoArr.splice(idx, 1);
        //delete this.trackInfoArr[idx];
        this.trackViewArr[idx].remove();
        delete this.trackViewArr[idx];
        //this.trackViewArr.splice(idx, 1);
    }

}