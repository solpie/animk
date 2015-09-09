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
    _layers:Array<ImageLayerInfo>;

    constructor() {
        super();
        // <reference path="../../util/psd/PsdMaker.ts"/>
        this.watchPOIArr = [];
        this._layers = [];
    }

    updateWatchArr() {
        this._updateCount++;
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi:POI = this.watchPOIArr[i];
            poi.psd2png();

            //poi.imageInfoArr.map((imageInfo:ImageInfo)=> {
            //    imageInfo.reloadImg();
            //});
        }
        appInfo.emit(TheMachineEvent.UPDATE_IMG);
    }

    cleanLayer() {
        this._layers.length = 0;
    }

    addLayer(imageInfo:ImageInfo, opacity, isRef) {
        var imageLayerInfo = new ImageLayerInfo();
        imageLayerInfo.filename = imageInfo.filename;
        imageLayerInfo.opacity = opacity;
        imageLayerInfo.isRef = isRef;
        imageLayerInfo.imageInfo = imageInfo;
        this._layers.push(imageLayerInfo);
    }

    watchAct() {
        var trackInfoArr = appInfo.curComp().getCompTrackInfoArr();
        this.cleanLayer();
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo:TrackInfo = trackInfoArr[i];
            if (trackInfo.actType() != ImageTrackActType.NOEDIT) {
                var imageInfo:ImageInfo = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (imageInfo) {
                    var isRef = (trackInfo.actType() == ImageTrackActType.REF);
                    this.addLayer(imageInfo, trackInfo.opacity(), isRef);
                }
            }
        }
        if (this._layers.length) {
            var poi = new POI();
            var basename = appInfo.curComp().name() + "frame" + appInfo.curComp().getCursor() + ".psd";
            poi.basename = basename;
            poi.filename = M_path.join(appInfo.settingInfo.tmpPath(), basename);
            this.watchPOIArr.push(poi);
            var parsingCount = 0;
            var onParsed = ()=> {
                parsingCount++;
                if (parsingCount < this._layers.length)
                    this._layers[parsingCount].load(onParsed);
                else
                    ImageLayerInfo.png2psd(this._layers, appInfo.projectInfo.curComp.width,
                        appInfo.projectInfo.curComp.height, "rgba",
                        poi.filename, (p)=> {
                            this.open(p);
                        });

            };
            poi.imageLayerInfoArr = this._layers.concat();
            this._layers[0].load(onParsed);
        }
    }

    onPOIchange(path) {
        for (var i = 0; i < this.watchPOIArr.length; i++) {
            var poi:POI = this.watchPOIArr[i];
            if (poi.basename == path) {
                this._updateCount++;
                poi.psd2png();
            }
        }
        console.log(this, "onPOIchange", path);
    }

    watchPOI(path:string) {
        console.log(this, "watchPOI", path);
        fs.watch(path, (event, filename)=> {
            console.log('event is: ' + event);
            if (filename) {
                console.log('filename provided: ' + filename);
                if (event == "change") {
                    this.onPOIchange(filename);
                }
            } else {
                console.log('filename not provided');
            }
        });
    }


    open(path:string) {
        path = path.replace("/", "\\");
        var self = this;
        self.watchPOI(path);
        console.log(this, "open:", path);

        exec('"C:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
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
}