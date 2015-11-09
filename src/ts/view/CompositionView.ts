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

        this.compInfo.on(CompInfoEvent.UPDATE_CURSOR, (frameIdx) => {
            this.updateCursor(frameIdx);
        });
        this.compInfo.on(CompInfoEvent.SWAP_TRACK, (idsArr:Array<number>) => {
            this.onSwapTrack(idsArr[0], idsArr[1]);
        });
        this.compInfo.on(CompInfoEvent.NEW_TRACK, (trackInfo:TrackInfo) => {
            this.newTrackView(trackInfo);
        });

        this.compInfo.on(CompInfoEvent.DEL_TRACK, (idx:number)=> {
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
                var trackId$ = ElmClass$.Track + "#" + trackInfo.idx2();
                clip$ = $(trackId$ + " " + ElmClass$.Clip);
                clip$.css({left: trackInfo.start() * frameWidth - this._hScrollVal});
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
        this.updateMaxTrackWidth();
        appInfo.emit(TheMachineEvent.UPDATE_IMG);
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
        appInfo.emit(TheMachineEvent.UPDATE_IMG);
    }

    onSelectFrame(selArr) {
        this._selectFrame = selArr;
        var trackIdx = selArr[0];
        var frameIdx = selArr[1];
        for (var i = 0; i < this.trackViewArr.length; i++) {
            var trackView:TrackView = this.trackViewArr[i];
            if (trackView) {
                if (i != trackIdx)
                    trackView.setActFrame(-1);
                else
                    trackView.setActFrame(frameIdx);
            }
        }
    }


    newTrackView(trackInfo:TrackInfo) {
        trackInfo.on(TrackInfoEvent.SEL_TRACK, (trackInfo:TrackInfo) => {
            this.onSelTrackView(trackInfo);
        });

        trackInfo.on(TrackInfoEvent.SET_TRACK_START, (trackInfo:TrackInfo) => {
            this.onUpdateTrackStart(trackInfo);
        });
        appInfo.tm.watchTrack(trackInfo);

        trackInfo.on(TrackInfoEvent.SEL_FRAME, (selArr)=> {
            this.onSelectFrame(selArr);
        });
        var top = 0;
        this.trackViewArr.map((tv:TrackView)=> {
            top += tv.height();
        });
        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        console.log(this, "new Track Top", top, "layerIdx", trackInfo.layerIdx());
        view.setParent($(CompositionId$));
        view.top(top);

        //trackInfo.opacity(trackInfo.opacity());
        //trackInfo.enable(trackInfo.enable());

        this._trackHeight += view.height();
        this.setTrackHeight(this._trackHeight);
        view.hScrollTo(this._hScrollVal);
        this.updateMaxTrackWidth();
        appInfo.emit(TheMachineEvent.UPDATE_IMG);
    }

    updateMaxTrackWidth() {
        var frameWidth = appInfo.frameWidth();
        var compMaxWidth:number = (this.compInfo.getMaxSize() + 4) * frameWidth;
        $(ElmId$.trackWidth).width(compMaxWidth);
    }

    onSwapTrack(idxA:number, idxB:number) {
        var trackViewA:TrackView;
        var trackViewB:TrackView;
        for (var i = 0; i < this.trackViewArr.length; i++) {
            var trackView:TrackView = this.trackViewArr[i];
            if (trackView.trackInfo.idx2() == idxA) {
                trackViewA = trackView;
            }
            if (trackView.trackInfo.idx2() == idxB) {
                trackViewB = trackView;
            }
        }
        if (trackViewA && trackViewB) {
            var aTop = $(trackViewA.id$).position().top;
            trackViewA.top($(trackViewB.id$).position().top);
            trackViewB.top(aTop);
            console.log(this, "onSwapTrack", trackViewA.trackInfo.name(), trackViewB.trackInfo.name());
        }
    }

    onDelTrackView(idx:number) {
        console.log(this, "onDelTrackView", idx + '');
        //this.trackInfoArr.splice(idx, 1);
        //delete this.trackInfoArr[idx];
        this._trackHeight -= this.trackViewArr[idx].height();
        this.setTrackHeight(this._trackHeight);
        var delTrackView:TrackView = this.trackViewArr[idx];
        var delTrackViewHeight = delTrackView.height();
        delTrackView.remove();
        delete this.trackViewArr[idx];
        for (var i = idx + 1; i < this.trackViewArr.length; i++) {
            var trackView:TrackView = this.trackViewArr[i];
            if (trackView) {
                trackView.top(trackView.top() - delTrackViewHeight);
            }
        }
        //this.trackViewArr.splice(idx, 1);
    }

}