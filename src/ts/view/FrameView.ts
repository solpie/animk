/// <reference path="BaseView.ts"/>
/// <reference path="../model/FrameInfo.ts"/>
class FrameView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;
    _height;
    _width;
    barHeight = 15;

    constructor(frameCanvasId:string) {
        super();
        this.canvasEl = document.getElementById(frameCanvasId);
        this.ctx = this.canvasEl.getContext("2d");

    }

    resize(w, h) {
        if (w != -1)
            this._width = w;
        if (h != -1)
            this._height = h;
        this.canvasEl.setAttribute("width", this._width + "");
        this.canvasEl.setAttribute("height", this._height + "");
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
                console.log(this, "Frame idx", frameInfo.getIdx(), "hold", frameInfo.getHold(), img.src);
                this.ctx.clearRect(frameX, this.barHeight, holdWidth, frameWidth);

                var thumbWidth = frameWidth - 1;
                var thumbHeight = thumbWidth / img.width * img.height;
                this.ctx.fillStyle = "#fff";
                this._fillRect(frameX + 1, this.barHeight, thumbWidth, thumbWidth);
                var thumbY = (thumbWidth - thumbHeight) * .5;
                this.ctx.drawImage(img, frameX + 1, thumbY + this.barHeight, thumbWidth, thumbHeight);

                if (frameInfo.getHold() > 1) {
                    this.ctx.font = '14px serif';
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.textAlign = "right";
                    this.ctx.fillText(frameInfo.getHold(), frameX + holdWidth - 10, 15 + this.barHeight);
                }
                ///////draw bar
                this._fillRect("#2f2f2f", frameX, 0, holdWidth, this.barHeight);
                /////// draw idx
                this.ctx.globalAlpha = 1;
                this.ctx.font = '10px serif';
                this.ctx.fillStyle = '#FFF';
                this.ctx.textAlign = "center";
                this.ctx.fillText(frameInfo.getIdx() + 1, frameX + frameWidth * .5, 10);
            }
            else {
                console.log(this, "can not comp trk ", i);
            }
        }
    }


    _fillRect(col, x, y, w, h, a?) {
        if (a)
            this.ctx.globalAlpha = a;
        this.ctx.fillStyle = col;
        this.ctx.fillRect(x, y, w, h);
    }
}
