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
        if (changeCount)
            this.resize(this._width + changeCount * frameWidth, this._height);
        console.log(this, "updateFrame");

        for (var i = 0; i < frameInfoArr.length; i++) {
            var frameInfo:FrameInfo = frameInfoArr[i];
            var img = frameInfo.imageInfo.img;
            if (img) {
                var frameX = (frameInfo.getStart() - 1) * frameWidth;
                var holdWidth = frameWidth * frameInfo.getHold();
                //console.log(this, "Frame", frameX, holdWidth, img.src);
                this.ctx.clearRect(frameX, 0, holdWidth, frameWidth);

                var thumbWidth = frameWidth - 1;
                var thumbHeight = thumbWidth / img.width * img.height;
                this.ctx.fillStyle = "#fff";
                this.ctx.fillRect(frameX + 1, 0, thumbWidth, thumbWidth);
                var thumbY = (thumbWidth - thumbHeight) * .5;
                this.ctx.drawImage(img, frameX + 1, thumbY, thumbWidth, thumbHeight);

                if (frameInfo.getHold() > 1) {
                    this.ctx.font = '14px serif';
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.textAlign = "right";
                    this.ctx.fillText(frameInfo.getHold(), frameX + holdWidth - 10, 15);
                }
                /////// draw idx
                this.ctx.globalAlpha = 0.6;
                this.ctx.fillStyle = "#333";
                this.ctx.fillRect(frameX, 27, frameWidth, 13);
                this.ctx.fillStyle = "#ddd";
                this.ctx.fillRect(frameX, 28, frameWidth, 1);
                this.ctx.globalAlpha = 1;
                this.ctx.font = '10px serif';
                this.ctx.fillStyle = '#FFF';
                this.ctx.textAlign = "center";
                this.ctx.fillText(frameInfo.getIdx() + 1, frameX + frameWidth*.5, 37);
            }
            else {
                console.log(this, "can not comp trk ", i);
            }
        }
    }
}
