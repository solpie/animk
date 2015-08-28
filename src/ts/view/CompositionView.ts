/// <reference path="BaseView.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="TrackView.ts"/>
/// <reference path="../model/CompositionInfo.ts"/>
/// <reference path="../model/FrameTimer.ts"/>

class CompositionView implements IBaseView {
    _maxTrackWidth:number = 0;

    render():HTMLElement {
        return undefined;
    }

    trackViewArr:Array<TrackView>;
    compInfo:CompositionInfo;
    _trackHeight:number = 0;
    _hScrollVal:number = 0;
    _selectFrame:Array<any>;//[trkIdx,frameIdx]

    constructor(compInfo:CompositionInfo) {
        this.compInfo = compInfo;
        this.trackViewArr = [];

        this.compInfo.add(CompInfoEvent.UPDATE_CURSOR, (frameIdx) => {
            this.updateCursor(frameIdx);
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

        $(ElmId$.timestampBar).on(MouseEvt.CLICK, (e)=> {
            this.onClkTimestampBar(e);
        });

        $(TrackHeightId$).width(1);

    }

    setCompInfo(compInfo:CompositionInfo) {
        if (!compInfo.isInit) {
            this.compInfo = compInfo;
            this.compInfo.isInit = true;
        }
    }

    onClkTimestampBar(e) {
        var mouseX = e.clientX - $(ElmId$.timestampBar).offset().left;
        var cursorIdx = Math.floor((mouseX + this.compInfo.hScrollVal) / this.compInfo.frameWidth);
        this.compInfo.setCursor(cursorIdx);
    }

    onHScroll() {
        this._hScrollVal = $(HScrollBarId$).scrollLeft();
        this.compInfo.hScrollVal = this._hScrollVal;
        var frameWidth = appInfo.frameWidth();
        var clip$;
        for (var i = 0; i < this.compInfo.trackInfoArr.length; i++) {
            var trackInfo:TrackInfo = this.compInfo.trackInfoArr[i];
            if (trackInfo) {
                var trackId$ = ElmClass$.Track + "#" + trackInfo.idx;
                clip$ = $(trackId$ + " " + ElmClass$.Clip);
                clip$.css({left: trackInfo.getStart() * frameWidth - this._hScrollVal});
                console.log(this, clip$);
            }
        }
        this.updateCursor();
    }

    setTrackHeight(val:number) {
        $(TrackHeightId$).height(val);
    }

    setCompositionHeight(val:number) {
        $(VScrollBarId$).height(val);
    }

    onUpdateTrackStart(trackInfo:TrackInfo) {
        this.updateMaxTrackWidth(trackInfo.getEnd() * appInfo.frameWidth());
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
        //this.updateCursor(-1);
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

    updateCursor(frameIdx?) {
        var fpos;
        if (frameIdx != -1) {
            fpos = frameIdx;
        }
        else
            fpos = this.compInfo.getCursor();
        $(ElmId$.cursor).css({
            left: fpos * appInfo.frameWidth() - this._hScrollVal
        });
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    }

    onSelectFrame(selArr) {
        this._selectFrame = selArr;
        var trackIdx = selArr[0];
        var frameIdx = selArr[1];
        for (var i = 0; i < this.trackViewArr.length; i++) {
            var trackView:TrackView = this.trackViewArr[i];
            if (trackView) {
                if (i != trackIdx)
                    trackView.setActFrame(0);
                else
                    trackView.setActFrame(frameIdx);
            }

        }
    }

    onNewTrackView(trackInfo:TrackInfo) {
        console.log(this, "onNewTrackView");
        trackInfo.add(TrackInfoEvent.SEL_TRACK, (trackInfo:TrackInfo) => {
            this.onSelTrackView(trackInfo);
        });
        trackInfo.add(TrackInfoEvent.UPDATE_TRACK_START, (trackInfo:TrackInfo) => {
            this.onUpdateTrackStart(trackInfo);
        });

        trackInfo.add(TrackInfoEvent.SEL_FRAME, (selArr)=> {
            this.onSelectFrame(selArr);
        });
        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        view.setParent($(CompositionId$));
        this._trackHeight += view.height();
        this.setTrackHeight(this._trackHeight);
        view.hScrollTo(this._hScrollVal);
        var newTrackWidth = (trackInfo.frameInfoArr.length) * appInfo.projectInfo.curComp.frameWidth;
        this.updateMaxTrackWidth(newTrackWidth);
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    }

    updateMaxTrackWidth(newTrackWidth) {
        var frameWidth = appInfo.frameWidth();
        var compMaxWidth:number = (this.compInfo.getMaxSize() + 4) * frameWidth;
        $(ElmId$.trackWidth).width(compMaxWidth);

        //if (compMaxWidth < newTrackWidth) {
        //    this.compInfo.setMaxSize(newTrackWidth);
        //    console.log('new TrackView', newTrackWidth);
        //}
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