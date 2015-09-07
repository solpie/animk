/// <reference path="../../event/ActEvent.ts"/>
/// <reference path="../../util/psd/PsdMaker.ts"/>
/// <reference path="POI.ts"/>
/// <reference path="../AppInfo.ts"/>
/// <reference path="../FrameInfo.ts"/>
/// <reference path="../../JQuery.ts"/>

//the government has a secret system a machine,spies on you every hour of every day.
var exec = require('child_process').exec;

class TheMachine extends EventDispatcher {
    ActFrameInfo:FrameInfo;
    watchArr:Array<POI>;
    _updateCount:number = 0;//for clear cache
    _layers:Array<ImageInfo>;

    constructor() {
        super();
        this.watchArr = [];
        this._layers = [];
    }

    updateWatchArr() {
        this._updateCount++;
        for (var i = 0; i < this.watchArr.length; i++) {
            var poi:POI = this.watchArr[i];
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

    addLayer(imageInfo:ImageInfo) {
        this._layers.push(imageInfo);
    }

    watchAct() {
        //if (this.ActFrameInfo) {
        //    if (this.watchArr.indexOf(this.ActFrameInfo) > -1) {
        //        console.log(this, "watching");
        //    }
        //    else {
        //        this.watchArr.push(this.ActFrameInfo);
        //        this.emit(TheMachineEvent.ADD_IMG);
        //    }
        //    this.open(this.ActFrameInfo.imageInfo.filename);
        //}
        if (this._layers.length) {
            var poi = new POI();
            poi.filename = "D:\\projects\\animk\\test\\comp.psd";
            this.watchArr.push(poi);
            var pngDataArr = [];
            var parsingCount = 0;
            var onParsed = ()=> {
                parsingCount++;
                if (parsingCount < pngDataArr.length)
                    pngDataArr[parsingCount].load(onParsed);
                else
                    PsdMaker.convertPNGs2PSD(pngDataArr, appInfo.projectInfo.curComp.width,
                        appInfo.projectInfo.curComp.height, "rgba", poi.filename, this.open);
            };

            for (var i = 0; i < this._layers.length; i++) {
                var imageInfo:ImageInfo = this._layers[i];
                poi.imageInfoArr.push(imageInfo);
                var pngData:PngLayerData = new PngLayerData();
                pngDataArr.push(pngData);
                pngData.opacity = imageInfo.opacity;
                pngData.filename = imageInfo.filename;
            }
            pngDataArr[0].load(onParsed);
        }
    }

    open(path:string) {
        path = path.replace("/", "\\");
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