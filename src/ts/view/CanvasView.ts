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
        var trackInfoArr = appInfo.projectInfo.curComp.trackInfoArr;
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo:TrackInfo = trackInfoArr[i];
            if (trackInfo && trackInfo.getEnable()) {
                var img:Image = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (img) {
                    //console.log(this, "comp", img.src);
                    //this.ctx.save();
                    this.ctx.globalAlpha = trackInfo.getOpacity();
                    this.ctx.drawImage(img, 0, 0);
                    //this.ctx.restore();
                }
                else {
                    console.log(this, "can not comp trk ", i);
                }
            }
        }
    }
}