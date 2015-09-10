/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>

class CanvasView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;
    _height;
    _width;
    isRender:boolean;

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
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo:TrackInfo = trackInfoArr[i];
            if (trackInfo && trackInfo.enable()) {
                var imageInfo:ImageInfo = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (imageInfo) {
                    //console.log(this, "comp", trackInfo.opacity(), trackInfo.name());
                    //this.ctx.save();
                    if (appInfo.curComp().isRendering && trackInfo.actType() == ImageTrackActType.REF) {
                        continue;
                    }
                    this.ctx.globalAlpha = trackInfo.opacity();
                    this.ctx.drawImage(imageInfo.img, 0, 0);
                }
                else {
                    console.log(this, "can not comp trk ", i);
                }
            }
        }
        if (appInfo.curComp().isRendering)
            appInfo.curComp().renderPng(this._getCompBuf())
    }
    _getCompBuf(){
        var imgData = this.canvasEl.toDataURL('image/png');
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        return new Buffer(base64Data, 'base64');
    }
    renderPng() {
        var imgData = this.canvasEl.toDataURL('image/png');
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');
        fs.writeFile("../test/testComp.png", dataBuffer, function (err) {
            if (err) {
                //response.write(err);
                console.log(this, "err", err);

            } else {
                console.log(this, "sus");
                //response.write("±£´æ³É¹¦£¡");
            }
        });
    }
}