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
                this.ctx.drawImage(img, frameX + 1, 0, frameWidth - 1, frameWidth - 1);
                if (frameInfo.getHold() > 1) {
                    this.ctx.font = '14px serif';
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.textAlign = "right";
                    this.ctx.fillText(frameInfo.getHold(), frameX + holdWidth - 10, 15);
                }
                /////// draw idx
                this.ctx.fillStyle = "#333";
                this.ctx.fillRect(frameX, 25, 15, 15);

                this.ctx.font = '10px serif';
                this.ctx.fillStyle = '#FFF';
                this.ctx.textAlign = "left";
                this.ctx.fillText(frameInfo.getIdx()+1, frameX + 2, 36);
            }
            else {
                console.log(this, "can not comp trk ", i);
            }
        }
    }
}
