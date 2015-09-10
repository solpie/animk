/// <reference path="../../event/ActEvent.ts"/>

/// <reference path="../../util/psd/PsdFile.ts"/>
/// <reference path="../../util/psd/PsdImage.ts"/>
/// <reference path="POI.ts"/>
/// <reference path="ImageLayerInfo.ts"/>
/// <reference path="../AppInfo.ts"/>
/// <reference path="../FrameInfo.ts"/>
/// <reference path="../../JQuery.ts"/>

//the government has a secret system a machine,spies on you every hour of every day.
var exec = require('child_process').exec;

class TheMachine extends EventDispatcher {
    ActFrameInfo:FrameInfo;
    watchPOIArr:Array<POI>;
    _updateCount:number = 0;//for clear cache

    constructor() {
        super();
        // <reference path="../../util/psd/PsdMaker.ts"/>
        this.watchPOIArr = [];
    }

    updateWatchArr() {
        this._updateCount++;
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi:POI = this.watchPOIArr[i];
            poi.psd2png();

        }
        appInfo.emit(TheMachineEvent.UPDATE_IMG);
    }

    _buildLayerArr():Array<ImageLayerInfo> {
        var trackInfoArr = appInfo.curComp().getCompTrackInfoArr();
        var watchArr:Array<ImageLayerInfo> = [];
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo:TrackInfo = trackInfoArr[i];
            if (trackInfo.actType() != ImageTrackActType.NOEDIT) {
                var imageInfo:ImageInfo = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (imageInfo) {
                    var isRef = (trackInfo.actType() == ImageTrackActType.REF);
                    var imageLayerInfo = new ImageLayerInfo();
                    imageLayerInfo.filename = imageInfo.filename;
                    imageLayerInfo.opacity = trackInfo.opacity();
                    imageLayerInfo.isRef = isRef;
                    imageLayerInfo.imageInfo = imageInfo;
                    watchArr.push(imageLayerInfo);
                }
            }
        }
        return watchArr;
    }

    watchTrack(trackInfo:TrackInfo) {
        trackInfo.on(TrackInfoEvent.SET_TRACK_START, (trackInfo:TrackInfo) => {
            this._rebuild();
        });
    }

    _rebuild() {
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi:POI = this.watchPOIArr[i];
            if (poi.watchCallback) {
                console.log(this, "_rebuild", poi.filename);
                poi.isBeingWatched = false;
            }
        }
        this.watchPOIArr.length = 0;
    }

    _isExistPOI() {
        var basename = this._getCurFrameBaseName();
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi:POI = this.watchPOIArr[i];
            if (poi.basename == basename) {
                return poi;
            }
        }
        return null;
    }

    _getCurFrameBaseName() {
        return appInfo.curComp().name() + "frame" + appInfo.curComp().getCursor() + ".psd";
    }

    watchCurFrame() {
        var existPOI = this._isExistPOI();
        if (existPOI) {
            console.log(this, "cur frame exist");
            this.open(existPOI.filename);
            return;
        }

        var arrayImageLayerInfo:Array<ImageLayerInfo> = this._buildLayerArr();
        if (arrayImageLayerInfo.length) {
            var poi = new POI();
            var basename = this._getCurFrameBaseName();
            poi.basename = basename;
            poi.filename = M_path.join(appInfo.settingInfo.tmpPath(), basename);
            this.watchPOIArr.push(poi);
            var parsingCount = 0;
            var onParsed = ()=> {
                parsingCount++;
                if (parsingCount < arrayImageLayerInfo.length)
                    arrayImageLayerInfo[parsingCount].load(onParsed);
                else {
                    console.log(this, "new poi");
                    ImageLayerInfo.png2psd(arrayImageLayerInfo, appInfo.projectInfo.curComp.width,
                        appInfo.projectInfo.curComp.height, "rgba",
                        poi.filename, (p)=> {
                            this.open(p);
                            this.watchPOI(poi);
                        });
                }
            };
            poi.imageLayerInfoArr = arrayImageLayerInfo;
            arrayImageLayerInfo[0].load(onParsed);
        }
    }

    onPOIchange(path) {
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi:POI = this.watchPOIArr[i];
            if (poi.isBeingWatched && poi.basename == path) {
                this._updateCount++;
                poi.psd2png();
            }
        }
        console.log(this, "onPOIchange", path);
    }

    watchPOI(poi:POI) {
        //fs.unwatchFile
        var path = poi.filename;
        poi.isBeingWatched = true;
        console.log(this, "watchPOI", path);
        if (!poi.watchCallback) {
            poi.watchCallback = (event, filename)=> {
                console.log('event is: ' + event);
                if (filename) {
                    console.log('filename provided: ' + filename);
                    if (event == "change") {
                        this.onPOIchange(filename);
                    }
                } else {
                    console.log('filename not provided');
                }
            }
        }
        fs.watch(path, poi.watchCallback);
    }


    open(path:string) {
        if (appInfo.settingInfo.drawApp1Path()) {

            path = path.replace("/", "\\");
            console.log(this, "open:", path);
            var appPath = '"' + appInfo.settingInfo.drawApp1Path().replace("/", "\\") + '" ';
            exec(appPath + path, function (error, stdout, stderr) {
                //exec('"C:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
                if (stdout) {
                    console.log('stdout: ' + stdout);
                }
                if (stderr) {
                    console.log('stderr: ' + stderr);
                }
                if (error !== null) {
                    console.log('Exec error: ' + error);
                }
            });
        }
        else {
            cmd.emit(CommandId.ShowSettingWin);
        }

    }
}