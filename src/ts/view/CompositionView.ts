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
    _trackHeight:number = 0;

    constructor(compInfo:CompositionInfo) {
        this.compInfo = compInfo;
        this.trackViewArr = [];
        this.compInfo.add(ActEvent.NEW_TRACK, (trackInfo:TrackInfo) => {
            this.onNewTrackView(trackInfo);
        });

        this.compInfo.add(ActEvent.DEL_TRACK, (idx:number)=> {
            this.onDelTrackView(idx);
        });
        this.trackViewArr = [];

        this.setCompositionHeight($(CompositionId$).height());
        $("#compositionHeight").on('scroll', () => {
            var top = $("#compositionHeight").scrollTop();
            $("#composition").scrollTop(top);
            console.log(this, 'scroll', top);
        });

    }

    setTrackHeight(val:number) {
        $("#trackHeight").height(val);
    }

    setCompositionHeight(val:number) {
        $("#compositionHeight").height(val);
    }

    onSelTrackView(trackInfo:TrackInfo) {
        var trackView:TrackView;
        for (var i in this.trackViewArr) {
            trackView = this.trackViewArr[i];
            if (trackView) {
                if (trackView.trackInfo == trackInfo)
                    trackView.setSelected(true);
                else
                    trackView.setSelected(false);
            }
            console.log(this, i);
        }
    }

    onNewTrackView(trackInfo:TrackInfo) {
        console.log(this, "onNewTrackView");
        trackInfo.add(ActEvent.SEL_TRACK, (trackInfo:TrackInfo) => {
            this.onSelTrackView(trackInfo);
        });
        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        view.setParent($(CompositionId$));
        this._trackHeight += view.height();
        this.setTrackHeight(this._trackHeight);
        console.log('new TrackView', view.el);
    }

    onDelTrackView(idx:number) {
        console.log(this, "onDelTrackView", idx + '');
        //this.trackInfoArr.splice(idx, 1);
        //delete this.trackInfoArr[idx];
        this._trackHeight -= this.trackViewArr[idx].height();
        this.setTrackHeight(this._trackHeight);
        this.trackViewArr[idx].remove();
        delete this.trackViewArr[idx];
        //this.trackViewArr.splice(idx, 1);
    }

}