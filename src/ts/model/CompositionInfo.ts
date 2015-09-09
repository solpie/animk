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

    static clone(val:CompositionData) {
        //todo clone this
    }
}
class CompositionInfo extends EventDispatcher {
    name:string;
    framerate:number = 24;
    trackInfoArr:Array<TrackInfo>;
    _compTrackInfoArr:Array<TrackInfo>;
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

        this._frameTimer = new FrameTimer(framerate);
        this._frameTimer.on(FrameTimerEvent.TICK, ()=> {
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
        this.emit(CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
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

    walk(path):Array<FrameData> {
        var fileArr = [];
        var dirArr = fs.readdirSync(path);
        dirArr.forEach(function (item) {
            if (fs.statSync(path + '/' + item).isDirectory()) {
                //walk(path + '/' + item);
            } else {
                var filename = path + '/' + item;
                fileArr.push({filename: filename});
                console.log("file:", filename);
            }
        });
        return fileArr;
    }

    newTrack(path) {
        var trackData:TrackData = new TrackData();
        trackData.frames = this.walk(path);
        trackData.name = 'track#' + this.trackInfoArr.length;
        trackData.path = path;
        trackData.start = 1;
        this.newTrackByTrackData(trackData);
    }

    newTrackByTrackData(trackData:TrackData) {
        var trackInfo:TrackInfo = new TrackInfo(trackData);
        trackInfo.newImage(trackData.frames);
        trackInfo.path(trackData.path);
        trackInfo.start(trackData.start);
        trackInfo.idx2(this.trackInfoArr.length);
        trackInfo.layerIdx(this.trackInfoArr.length);
        this.appendTrackInfo(trackInfo);
        this.emit(CompInfoEvent.NEW_TRACK, trackInfo);
    }

    appendTrackInfo(trackInfo:TrackInfo) {
        this.trackInfoArr.push(trackInfo);
        this._updateCompTrackArr();
    }

    getSelTrackInfo() {
        for (var i = 0; i < this.trackInfoArr.length; i++) {
            var trackInfo:TrackInfo = this.trackInfoArr[i];
            if (trackInfo && trackInfo.isSelected) {
                return trackInfo;
            }
        }
    }

    delSelTrack() {
        var trackInfo:TrackInfo;
        for (var i in this.trackInfoArr) {
            trackInfo = this.trackInfoArr[i];
            if (trackInfo && trackInfo.isSelected) {
                this.delTrack(trackInfo.idx2());
                break;
            }
        }
    }

    delTrack(idx:number) {
        //this.trackInfoArr.splice(idx, 1);
        delete this.trackInfoArr[idx];
        console.log(this, "delTrack", idx + '');
        this.getMaxSize();
        this.emit(CompInfoEvent.DEL_TRACK, idx);
        //this.trackViewArr.splice(idx, 1);
    }

    getCompTrackInfoArr() {
        if (!this._compTrackInfoArr)
            this._updateCompTrackArr();
        return this._compTrackInfoArr;
    }

    _updateCompTrackArr() {
        var compare = function (prop) {
            return function (obj1, obj2) {
                var val1 = obj1[prop];
                var val2 = obj2[prop];
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
        var a = [];
        this.trackInfoArr.map((tInfo)=> {
            if (tInfo)
                a.push(tInfo);
        });
        a.sort(compare("_layerIdx"));
        this._compTrackInfoArr = a;
    }

    moveTrack(deltaIdx) {
        var trackInfo:TrackInfo = this.getSelTrackInfo();
        if (trackInfo) {
            var trackInfoB:TrackInfo;
            var compTrackInfoArr:Array<TrackInfo> = this.getCompTrackInfoArr();
            console.log(this, "compTrackInfoArr", compTrackInfoArr.length);
            if (deltaIdx > 0) {// move down
                for (var i = 0; i < compTrackInfoArr.length; i++) {
                    var tInfo:TrackInfo = compTrackInfoArr[i];
                    if (tInfo && tInfo.layerIdx() > trackInfo.layerIdx()) {
                        trackInfoB = tInfo;
                        break;
                    }
                }
            }
            else {
                for (var i = compTrackInfoArr.length - 1; i > -1; i--) {
                    var tInfo:TrackInfo = compTrackInfoArr[i];
                    if (tInfo && tInfo.layerIdx() < trackInfo.layerIdx()) {
                        trackInfoB = tInfo;
                        break;
                    }
                }
            }
            if (trackInfoB)
                this.swapTrack(trackInfo.idx2(), trackInfoB.idx2());
        }
    }

    swapTrack(idxA:number, idxB:number) {


        var trackInfoA:TrackInfo = this.trackInfoArr[idxA];
        var trackInfoB:TrackInfo = this.trackInfoArr[idxB];
        if (trackInfoA && trackInfoB) {
            var tmpLayerIdx = trackInfoA.layerIdx();
            console.log(this, "swapTrack BF", trackInfoA.idx2(), trackInfoA.layerIdx());
            trackInfoA.layerIdx(trackInfoB.layerIdx());
            trackInfoB.layerIdx(tmpLayerIdx);
            console.log(this, "swapTrack AT", trackInfoA.idx2(), trackInfoA.layerIdx());
            this._updateCompTrackArr();
            this.emit(CompInfoEvent.SWAP_TRACK, [idxA, idxB])
        }
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