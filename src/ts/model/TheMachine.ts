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
            var pngDataArr = [];


            var parsingCount = 0;
            var onParsed = ()=> {
                parsingCount++;
                if (parsingCount < pngDataArr.length) {
                    pngDataArr[parsingCount].load(onParsed);
                }
                else {
                    console.log(this, "convertPNGs2PSD");
                    PsdMaker.convertPNGs2PSD(pngDataArr, appInfo.projectInfo.curComp.width,
                        appInfo.projectInfo.curComp.height, "rgba", "D:\\projects\\animk\\test\\comp.psd", this.open);
                    //this.open("../test/comp.psd");
                }
            };

            for (var i = 0; i < this._layers.length; i++) {
                var imageInfo:ImageInfo = this._layers[i];
                var pngData:PngLayerData = new PngLayerData();
                pngDataArr.push(pngData);
                pngData.width = imageInfo.width;
                pngData.height = imageInfo.height;
                pngData.opacity = imageInfo.opacity;
                pngData.filename = imageInfo.filename;
            }
            pngDataArr[0].load(onParsed);

            //pngPathArr.map(function (imageInfo:ImageInfo) {
            //    var png = new PNG({
            //        filterType: 4
            //    });
            //    fs.createReadStream(imageInfo.filename)
            //        .pipe(png)
            //        .on('parsed', function (data) {
            //            //this is PNG
            //            var image = this;
            //            image.pixels = image.data;
            //            image.colorSpace = 'rgba';
            //            image.opacity = imageInfo.opacity;
            //            pngDataArr.push(image);
            //            //console.log(this, "parsed", new Date().getTime() - startTime);
            //            onParsed();
            //        });
            //})

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