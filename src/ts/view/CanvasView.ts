/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>

class CanvasView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;
    _height;
    _width;

    constructor() {
        super()
    }

    init() {
        var c:HTMLElement = document.getElementById("Canvas0");
        this.ctx = c.getContext("2d");
        this.canvasEl = c;
        this.resize(1280, 720);
    }

    resize(w, h) {
        this._width = w;
        this._height = h;
        this.canvasEl.setAttribute("width", w + "");
        this.canvasEl.setAttribute("height", h + "");
    }

    updateComp() {
        this.ctx.clearRect(0, 0, this._width, this._height);
        var trackInfoArr = appInfo.curComp().getCompTrackInfoArr();
        appInfo.tm.cleanLayer();
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo:TrackInfo = trackInfoArr[i];
            if (trackInfo && trackInfo.enable()) {
                var imageInfo:ImageInfo = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (imageInfo) {
                    if (trackInfo.actType() != ImageTrackActType.NOEDIT) {
                        var isRef = (trackInfo.actType() == ImageTrackActType.REF);
                        appInfo.tm.addLayer(imageInfo, trackInfo.opacity(), isRef);
                    }
                    //console.log(this, "comp", img.src);
                    //this.ctx.save();
                    this.ctx.globalAlpha = trackInfo.opacity();
                    this.ctx.drawImage(imageInfo.img, 0, 0);
                    //this.ctx.restore();
                    this.savePng();
                }
                else {
                    console.log(this, "can not comp trk ", i);
                }
            }
        }
    }

    savePng() {
        //var dataURL = this.canvasEl.toDataURL('image/png');
        //console.log(this, dataURL);
        ////dataURL = dataURL.replace("image/png", "image/octet-stream");
        //var dataBuffer = new Buffer(dataURL, 'base64');
        //fs.writeFile("test.png", dataBuffer, function (err) {
        //    if (err) {
        //        //response.write(err);
        //        console.log(this, "err", err);
        //
        //    } else {
        //        console.log(this, "sus");
        //        //response.write("±£´æ³É¹¦£¡");
        //    }
        //});
    }
}