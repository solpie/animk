/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../util/psd/PsdMaker.ts"/>
/// <reference path="AppInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
/// <reference path="../JQuery.ts"/>

//the government has a secret system a machine,spies on you every hour of every day.
var exec = require('child_process').exec;

class TheMachine extends EventDispatcher {
    actImg:string;
    ActFrameInfo:FrameInfo;
    watchArr:Array<FrameInfo>;
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
            var frameInfo:FrameInfo = this.watchArr[i];
            frameInfo.imageInfo.reloadImg();
            $(frameInfo.id$).attr("src", frameInfo.imageInfo.filename + "?fc=" + this._updateCount);
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
            var pngPathArr = this._layers;
            var pngDataArr = [];
            var parsingCount = pngPathArr.length;
            var onParsed = function () {
                parsingCount--;
                if (parsingCount) {

                }
                else {
                    PsdMaker.convertPNGs2PSD(pngDataArr, appInfo.projectInfo.curComp.width,
                        appInfo.projectInfo.curComp.height, "rgba", "../test/comp.psd")
                }
            };
            pngPathArr.map(function (imageInfo:ImageInfo) {
                var png = new PNG({
                    filterType: 4
                });
                png.opacity = imageInfo.opacity;
                fs.createReadStream(imageInfo.filename)
                    .pipe(png)
                    .on('parsed', function (data) {
                        //this is PNG
                        var image = this;
                        image.pixels = image.data;
                        image.colorSpace = 'rgba';
                        pngDataArr.push(image);
                        //console.log(this, "parsed", new Date().getTime() - startTime);
                        onParsed();
                    });
            })

        }
    }

    open(path:string) {
        path = path.replace("/", "\\");
        console.log(this, "open:", path);
        exec('"D:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
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