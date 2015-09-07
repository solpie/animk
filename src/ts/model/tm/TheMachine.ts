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
    watchArr:Array<POI>;
    _updateCount:number = 0;//for clear cache
    _layers:Array<ImageInfo>;

    constructor() {
        super();
        // <reference path="../../util/psd/PsdMaker.ts"/>
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
            var imageLayerInfoArr = [];
            var parsingCount = 0;
            var onParsed = ()=> {
                parsingCount++;
                if (parsingCount < imageLayerInfoArr.length)
                    imageLayerInfoArr[parsingCount].load(onParsed);
                else
                    ImageLayerInfo.png2psd(imageLayerInfoArr, appInfo.projectInfo.curComp.width,
                        appInfo.projectInfo.curComp.height, "rgba",
                        poi.filename, this.open);
            };

            for (var i = 0; i < this._layers.length; i++) {
                var imageInfo:ImageInfo = this._layers[i];
                poi.imageInfoArr.push(imageInfo);
                var imageLayerInfo:ImageLayerInfo = new ImageLayerInfo();
                imageLayerInfoArr.push(imageLayerInfo);
                imageLayerInfo.opacity = imageInfo.opacity;
                imageLayerInfo.filename = imageInfo.filename;
            }
            imageLayerInfoArr[0].load(onParsed);
        }
    }


    //PNGcomp2PSD(pngArr:Array<ImageLayerInfo>, w, h, colorSpace, path:string) {
    //    // create psd data
    //    var psd = new PsdFile(w, h, colorSpace);
    //
    //    // append layer
    //    var pngLayer:ImageLayerInfo;
    //    for (var i = 0; i < pngArr.length; i++) {
    //        pngLayer = pngArr[i];
    //        var image = new PsdImage(pngLayer.width, pngLayer.height,
    //            colorSpace, pngLayer.pixels);
    //        var layer = new Layer();
    //        layer.drawImage(image);
    //        layer.opacity = pngLayer.opacity;
    //        psd.appendLayer(layer);
    //    }
    //
    //    // create merged image data
    //    var b = new Buffer(4);
    //    psd.imageData = new PsdImage(1, 1,
    //        colorSpace, b);
    //
    //    fs.writeFile(path, psd.toBinary(), (err) => {
    //        if (err) throw err;
    //        this.open(path);
    //    });
    //}

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