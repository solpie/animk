/// <reference path="BaseView.ts"/>

class TimestampView extends BaseView {
    canvasEl:HTMLElement;
    ctx:any;
    _height;
    _width;

    constructor() {
        super(ElmId$.timestamp);
        this.canvasEl = document.getElementById("Timestamp0");
        this.ctx = this.canvasEl.getContext("2d");
        this.resize(1500, 20);

        cmd.on(CompInfoEvent.FRAME_WIDTH_CHANGE, ()=> {
            this._update();
        })
    }


    resize(w, h) {
        console.log(this, "resize width:", w);
        this._width = w;
        this.canvasEl.setAttribute("width", w + "");

        if (h > 0) {
            this._height = h;
        }
        this.canvasEl.setAttribute("height", this._height + "");
        this._update();
    }

    _update() {
        var frameWidth;
        if (appInfo.projectInfo && appInfo.projectInfo.curComp) {
            frameWidth = appInfo.frameWidth();
        }
        else
            frameWidth = 40;

        console.log(this, "draw timestamp", frameWidth, this._width);
        this.ctx.clearRect(0, 0, this._width, this._height);

        if (frameWidth >= 20) {
            var frameIdx;
            for (var i = 0; i < this._width; i += frameWidth) {
                this._fillRect("#ffffff", i, 0, 1, this._height);
                frameIdx = i / frameWidth;
                this.ctx.font = '10px serif';
                this.ctx.fillStyle = '#FFF';
                //this.ctx.textAlign = "center";
                this.ctx.fillText(frameIdx, i + 5, 10);
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