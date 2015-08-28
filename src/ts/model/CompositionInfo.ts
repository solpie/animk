/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="TrackInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
/// <reference path="FrameTimer.ts"/>
/// <reference path="../view/TrackView.ts"/>
/// <reference path="../Node.ts"/>

class CompositionData {
    name:string;
    framerate:number;
    framewidth:number;
    height:number;
    width:number;
    tracks:Array<TrackData>;
}
class CompositionInfo extends EventDispatcher {
    name:string;
    framerate:number = 24;
    trackInfoArr:Array<TrackInfo>;
    frameWidth:number = 40;
    width:number;
    height:number;
    hScrollVal:number = 0;
    _cursorPos:number = 1;
    _maxPos:number;
    _stayBack;
    _frameTimer:FrameTimer;
    isInit:boolean = false;


    constructor(width, height, framerate) {
        super();
        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.trackInfoArr = [];
        console.log("new CompInfo");

        this._frameTimer = new FrameTimer(framerate);
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
        if (this._cursorPos >= this._maxPos)
            this.setCursor(1);
        else
            this.setCursor(this._cursorPos + 1);
    }

    backward() {
        if (this._cursorPos > 1) {
            this.setCursor(this._cursorPos - 1);
        }
    }

    getCursor() {
        return this._cursorPos;
    }


    newTrack(path) {
        //var trackInfo = new TrackInfo();
        //trackInfo.newImage(walk(path));
        //trackInfo.path = path;
        //trackInfo.idx = this.trackInfoArr.length;
        //this.trackInfoArr.push(trackInfo);
        //trackInfo.name = 'track#' + trackInfo.idx;
        //
        //this.dis(CompInfoEvent.NEW_TRACK, trackInfo);
        //console.log(this, "newTrack idx", trackInfo.idx);
        this.newTrackByTrackData(walk(path), path, 'track#' + this.trackInfoArr.length);
    }

    newTrackByTrackData(frameDataArr, path, name) {
        var trackInfo:TrackInfo = new TrackInfo();
        trackInfo.newImage(frameDataArr);

        trackInfo.path = path;
        trackInfo.name = name;
        trackInfo.idx = this.trackInfoArr.length;
        this.trackInfoArr.push(trackInfo);
        this.dis(CompInfoEvent.NEW_TRACK, trackInfo);
    }


    delSelTrack() {
        var trackInfo:TrackInfo;
        for (var i in this.trackInfoArr) {
            trackInfo = this.trackInfoArr[i];
            if (trackInfo && trackInfo.isSelected) {
                this.delTrack(trackInfo.idx);
                break;
            }
        }
    }

    delTrack(idx:number) {
        //this.trackInfoArr.splice(idx, 1);
        delete this.trackInfoArr[idx];
        console.log(this, "delTrack", idx + '');
        this.getMaxSize();
        this.dis(CompInfoEvent.DEL_TRACK, idx);
        //this.trackViewArr.splice(idx, 1);
    }

    getMaxSize() {
        var maxFrame = 0;
        var trackEnd;
        for (var i = 0; i < this.trackInfoArr.length; i++) {
            var trackInfo:TrackInfo = this.trackInfoArr[i];
            if (trackInfo) {
                trackEnd = trackInfo.getEnd();
                if (maxFrame < trackEnd)
                    maxFrame = trackEnd;
            }
        }
        this._maxPos = maxFrame;
        return maxFrame
    }
}