/// <reference path="BaseView.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="TrackView.ts"/>
/// <reference path="../model/CompositionInfo.ts"/>

class CompositionView implements IBaseView {
    _maxTrackWidth:number = 0;

    render():HTMLElement {
        return undefined;
    }

    trackViewArr:Array<TrackView>;
    compInfo:CompositionInfo;
    _trackHeight:number = 0;
    _hScrollVal:number = 0;
    _cursorPos = 1;

    constructor(compInfo:CompositionInfo) {
        this.compInfo = compInfo;
        this.trackViewArr = [];

        this.compInfo.add(CompInfoEvent.UPDATE_CURSOR, (frameIdx) => {
            this.onUpdateCursor(frameIdx);
        });
        this.compInfo.add(CompInfoEvent.NEW_TRACK, (trackInfo:TrackInfo) => {
            this.onNewTrackView(trackInfo);
        });

        this.compInfo.add(CompInfoEvent.DEL_TRACK, (idx:number)=> {
            this.onDelTrackView(idx);
        });
        this.trackViewArr = [];

        this.setCompositionHeight($(CompositionId$).height());
        $(VScrollBarId$).on(ViewEvent.SCROLL, () => {
            var top = $(VScrollBarId$).scrollTop();
            $(CompositionId$).scrollTop(top);
            console.log(this, 'scroll', top);
        });

        $(HScrollBarId$).on(ViewEvent.SCROLL, () => {
            this.onHScroll();
        });
        $(TrackHeightId$).width(1);
    }

    onHScroll() {
        this._hScrollVal = $(HScrollBarId$).scrollLeft();
        this.compInfo.hScollVal = this._hScrollVal;
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clip$;
        for (var i = 0; i < this.compInfo.trackInfoArr.length; i++) {
            var trackInfo:TrackInfo = this.compInfo.trackInfoArr[i];
            var trackId$ = ElmClass$.Track + "#" + trackInfo.idx;
            clip$ = $(trackId$ + " " + ElmClass$.Clip);
            clip$.css({left: trackInfo.getStart()*frameWidth - this._hScrollVal});
            console.log(this, clip$);
        }
        this.onUpdateCursor();
    }

    setTrackHeight(val:number) {
        $(TrackHeightId$).height(val);
    }

    setCompositionHeight(val:number) {
        $(VScrollBarId$).height(val);
    }

    onUpdateTrackStart(trackInfo:TrackInfo) {
        this.updateMaxTrackWidth(trackInfo.getEnd() * appInfo.projectInfo.curComp.frameWidth);
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

    onUpdateCursor(frameIdx?) {
        var fpos;
        if (frameIdx) {
            fpos = frameIdx;
            this._cursorPos = fpos;
        }
        else
            fpos = this._cursorPos;
        $(ElmId$.Cursor).css({left: fpos * appInfo.projectInfo.curComp.frameWidth - this._hScrollVal})
    }

    onNewTrackView(trackInfo:TrackInfo) {
        console.log(this, "onNewTrackView");
        trackInfo.add(TrackInfoEvent.SEL_TRACK, (trackInfo:TrackInfo) => {
            this.onSelTrackView(trackInfo);
        });
        trackInfo.add(TrackInfoEvent.UPDATE_TRACK_START, (trackInfo:TrackInfo) => {
            this.onUpdateTrackStart(trackInfo);
        });
        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        view.setParent($(CompositionId$));
        this._trackHeight += view.height();
        this.setTrackHeight(this._trackHeight);
        view.hScrollTo(this._hScrollVal);
        var newTrackWidth = (trackInfo.frameInfoArr.length) * appInfo.projectInfo.curComp.frameWidth;
        this.updateMaxTrackWidth(newTrackWidth);
    }

    updateMaxTrackWidth(newTrackWidth) {
        if (this._maxTrackWidth < newTrackWidth) {
            this._maxTrackWidth = newTrackWidth;
            $(ElmId$.TrackWidth).width(newTrackWidth + 4 * appInfo.projectInfo.curComp.frameWidth);
            console.log('new TrackView', newTrackWidth);
        }
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