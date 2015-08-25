/// <reference path="BaseView.ts"/>
/// <reference path="../model/FrameInfo.ts"/>
class FrameView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;
    _height;
    _width;
    constructor(frameCanvasId:string) {
        super();
        this.canvasEl = document.getElementById(frameCanvasId);
        this.ctx = this.canvasEl.getContext("2d");
    }

    resize(w, h) {
        this._height = h;
        this._width = w;
        this.canvasEl.setAttribute("width", w + "");
        this.canvasEl.setAttribute("height", h + "");
    }


    updateFrame(frameInfoArr, changeCount?) {
        var frameWidth = appInfo.frameWidth();
        if(changeCount)
            this.resize(this._width + changeCount * frameWidth, this._height);
        for (var i = 0; i < frameInfoArr.length; i++) {
            var frameInfo:FrameInfo = frameInfoArr[i];
            var img = frameInfo.imageInfo.img;
            if (img) {
                var frameX = (frameInfo.getStart() - 1) * frameWidth;
                var holdWidth = frameWidth * frameInfo.getHold();
                console.log(this, "updateFrame", frameX, holdWidth, img.src);
                this.ctx.clearRect(frameX, 0, holdWidth,frameWidth);
                this.ctx.drawImage(img, frameX, 0, frameWidth, frameWidth);
            }
            else {
                console.log(this, "can not comp trk ", i);
            }
        }
    }
}
