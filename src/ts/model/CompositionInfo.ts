/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="TrackInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
/// <reference path="FrameTimer.ts"/>
/// <reference path="../view/TrackView.ts"/>
/// <reference path="../Node.ts"/>

class CompositionInfo extends EventDispatcher {
    trackInfoArr:Array<TrackInfo>;
    frameWidth:number = 40;
    hScrollVal:number = 0;
    _cursorPos:number = 1;
    _stayBack;
    _frameTimer:FrameTimer;


    constructor() {
        super();
        this.trackInfoArr = [];
        console.log("new CompInfo");

        this._frameTimer = new FrameTimer(24);
        this._frameTimer.add(FrameTimerEvent.TICK, ()=> {
            this.onFrameTimerTick();
        });
    }

    onFrameTimerTick() {
        this.forward();
    }

    play() {
        this._stayBack = this._cursorPos;
        this._frameTimer.start();
    }

    pause() {
        this._frameTimer.stop();
    }

    toggle() {
        if (this._frameTimer.isBusy())
            this.pause();
        else
            this.play();
    }

    stayBack() {
        if (this._stayBack > 0) {
            this.pause();
            this.setCursor(this._stayBack);
            this._stayBack = 0;
        }
        else if (this._stayBack == 0) {
            this.setCursor(1);
            this._stayBack = -1;
        }

    }

    setCursor(framePos) {
        this._cursorPos = framePos;
        this.dis(CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
    }

    forward() {
        this._cursorPos++;
        this.dis(CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
    }

    backward() {
        if (this._cursorPos > 1) {
            this._cursorPos--;
            this.dis(CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
        }
    }

    getCursor() {
        return this._cursorPos;
    }



    newTrack(path) {
        var trackInfo = new TrackInfo();
        trackInfo.newImage(walk(path));

        trackInfo.idx = this.trackInfoArr.length;
        trackInfo.name = 'track#' + trackInfo.idx;
        this.trackInfoArr.push(trackInfo);

        this.dis(CompInfoEvent.NEW_TRACK, trackInfo);
        console.log(this, "newTrack idx", trackInfo.idx);
    }


    delSelTrack() {
        var trackInfo:TrackInfo;
        for (var i in this.trackInfoArr) {
            trackInfo = this.trackInfoArr[i];
            if (trackInfo.isSelected) {
                this.delTrack(trackInfo.idx);
                break;
            }
        }
    }

    delTrack(idx:number) {
        //this.trackInfoArr.splice(idx, 1);
        delete this.trackInfoArr[idx];
        console.log(this, "delTrack", idx + '');
        this.dis(CompInfoEvent.DEL_TRACK, idx);
        //this.trackViewArr.splice(idx, 1);
    }
}