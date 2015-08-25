/// <reference path="BaseView.ts"/>
/// <reference path="../model/FrameInfo.ts"/>
class FrameView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;

    constructor(frameCanvasId:string) {
        super();
        this.canvasEl = document.getElementById(frameCanvasId);
        this.ctx = this.canvasEl.getContext("2d");
    }

    resize(w, h) {
        this.canvasEl.setAttribute("width", w + "");
        this.canvasEl.setAttribute("height", h + "");
    }


    updateFrame(frameInfoArr) {
        var frameWidth = appInfo.frameWidth();
        for (var i = 0; i < frameInfoArr.length; i++) {
            var frameInfo:FrameInfo = frameInfoArr[i];
            var img = frameInfo.imageInfo.img;
            if (img) {
                console.log(this, "updateFrame", img.src, this.ctx);
                this.ctx.drawImage(img, (frameInfo.getStart() - 1) * frameWidth, 0,
                    frameWidth, frameWidth);
                //this.ctx.drawImage(img, frameInfo.getStart() * 40, 0);
            }
            else {
                console.log(this, "can not comp trk ", i);
            }
        }
    }
}
