/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>

class CanvasView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;

    constructor() {
        super()
    }

    init() {
        var c:HTMLElement = document.getElementById("Canvas0");
        c.setAttribute("width", 1280 + "");
        c.setAttribute("height", 720 + "");
        this.ctx = c.getContext("2d");
        this.canvasEl = c;
    }

    updateComp() {
        var trackInfoArr = appInfo.projectInfo.curComp.trackInfoArr;
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo:TrackInfo = trackInfoArr[i];
            if (trackInfo) {
                var img:Image = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (img) {
                    //console.log(this, "comp", img.src);
                    this.ctx.drawImage(img, 0, 0);
                }
                else {
                    console.log(this, "can not comp trk ", i);
                }
            }
        }
    }
}