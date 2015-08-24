/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;
    _isPressBar:boolean;
    _isPressClip:boolean;
    _lastX:number;
    _timerId:number;
    _pickFrame:FrameInfo = null;
    constructor(trackInfo:TrackInfo) {
        super();
        this.trackInfo = trackInfo;
    }

    render() {
        var template = $('.Track-tpl').html();
        return Mustache.render(template, {
            idx: this.trackInfo.idx,
            name: this.trackInfo.name,
            frameIdxArr: this.trackInfo.getIdxArr(),
            //imgs: this.trackInfo.getImgs()
        });
    }

    setActFrame(frameIdx) {
        console.log(this, "SEL_FRAME", frameIdx, this.id$);
        var actHint = $(this.id$ + " " + ElmClass$.ActHint);
        if (frameIdx) {
            actHint.css({display: "block"});
            actHint.css({left: frameIdx * appInfo.projectInfo.curComp.frameWidth})
        }
        else {
            actHint.css({display: "none"})
        }
    }

    //use for add Child view to parent
    setParent(parent:JQuery) {
        super.setParent(parent);
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clipWidth = this.trackInfo.getHold() * frameWidth;
        var idx = this.trackInfo.idx;
        this.id$ = ElmClass$.Track + "#" + idx;
        this.el = $(this.id$)[0];
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        this.updateClip(0);
        clip.on(MouseEvt.DOWN, (e)=> {
            this.onMouseDown(e);
        });

        //clip.on(MouseEvt.LEAVE, (e)=> {
        //    //self._isPressBar = false;
        //    //self.stopMoveTimer();
        //    //console.log("mouseleave", "");
        //});

        appInfo.add(MouseEvt.UP, ()=> {
            this.onUp();
        });

        this.setColor('#444');
        console.log(this, "setParent2", clip, clipWidth);


        //todo MouseDown is duplicate
        $(this.id$).on(MouseEvt.DOWN, ()=> {
            if (this.trackInfo.isSelected && !this._isPressClip)
                this.setSelected(false);
            else
                this.trackInfo.dis(TrackInfoEvent.SEL_TRACK, this.trackInfo);
        });
        this.initFrame();
    }

    onMouseDown(e) {
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        var barHeight = $(this.id$ + " " + ElmClass$.Bar).height();
        this._lastX = appInfo.mouseX;
        var mouseY = e.clientY - $(this.id$).offset().top;
        this._isPressClip = true;
        if (mouseY < barHeight) {
            this._isPressBar = true;
        }
        else {
            var mouseX = e.clientX - clip.offset().left;
            var frameInfo = this.trackInfo.getFrameInfo(mouseX);
            this._pickFrame = frameInfo;
            console.log("Pick frame", mouseX, frameInfo, frameInfo.getIdx(), "Left", frameInfo.pressFlag);
        }
        this.startMoveTimer();
    }

    initFrame() {
        //set img src position
        for (var i = 0; i < this.trackInfo.getImgs().length; i++) {
            var frameWidth = appInfo.projectInfo.curComp.frameWidth;
            var frame$ = $(this.getFrameId$(i));
            frame$.css({left: i * frameWidth});
            var frameImg$ = $(this.getFrameId$(i) + " img");
            frameImg$.attr("src", this.trackInfo.getImgs()[i]);
            console.log(this, "pick frames", frameImg$);
        }
        this.trackInfo.add(TrackInfoEvent.UPDATE_HOLD, (pickFrame:FrameInfo)=> {
            this.onUpdateFrame(pickFrame, pickFrame.getIdx() + 1);
        });
        this.trackInfo.add(TrackInfoEvent.UPDATE_START, (pickFrame:FrameInfo)=> {
            this.onUpdateFrame(pickFrame, pickFrame.getIdx() - 1);
        });
    }

    updateClip(updateIdx:number) {
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        clip.css({left: this.trackInfo.getStart() * frameWidth - appInfo.projectInfo.curComp.hScrollVal});
        clip.width((this.trackInfo.getHold()) * frameWidth);
        for (var i = updateIdx; i < this.trackInfo.frameInfoArr.length; i++) {
            var nextFrameInfo = this.trackInfo.frameInfoArr[i];
            if (nextFrameInfo) {
                var nextframe$ = $(this.getFrameId$(i));
                nextframe$.css({left: (nextFrameInfo.getStart() - 1) * frameWidth});
            }
        }
    }

    onUpdateFrame(pickFrame:FrameInfo, updateIdx:number) {
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var frame$ = $(this.getFrameId$(pickFrame.getIdx()));
        frame$.width(pickFrame.getHold() * frameWidth);
        this.updateClip(updateIdx);
        //todo update composition max width
    }

    getFrameId$(idx) {
        return "#" + ElmClass$.TrackCls + this.trackInfo.idx + ElmClass$.Frame + (idx + 1)
    }

    onUp() {
        this._isPressBar = false;
        this._isPressClip = false;
        if (this._pickFrame)
        {
            this.trackInfo.dis(TrackInfoEvent.SEL_FRAME, [this.trackInfo.idx, this._pickFrame.getIdx()]);
            this._pickFrame.pressFlag = 0;
        }
        this._pickFrame = null;
        this.stopMoveTimer();
    }

    setSelected(val:boolean) {
        this.trackInfo.isSelected = val;
        if (val)//todo light color
            this.setColor("#666");
        else
            this.setColor("#444");
    }

    startMoveTimer() {
        this._timerId = window.setInterval(()=> {
            var clip = $(this.id$ + " " + ElmClass$.Clip);
            if (this._isPressClip) {
                var frameWidth = appInfo.projectInfo.curComp.frameWidth;
                var dx = appInfo.mouseX - this._lastX;
                if (dx > frameWidth) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.setStart(this.trackInfo.getStart() + 1);
                        clip.css({left: clip.position().left + frameWidth});
                    } else if (this._pickFrame) {
                        if (this._pickFrame.pressFlag == PressFlag.R)
                            this.trackInfo.R2R(this._pickFrame);
                        else if (this._pickFrame.pressFlag == PressFlag.L)
                            this.trackInfo.L2R(this._pickFrame);
                        //this.trackInfo.dis(TrackInfoEvent.SEL_FRAME,[this.trackInfo.idx,this._pickFrame.getIdx()])
                    }
                }
                else if (dx < -frameWidth) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.setStart(this.trackInfo.getStart() - 1);
                        clip.css({left: clip.position().left - frameWidth});
                    } else if (this._pickFrame) {
                        if (this._pickFrame.pressFlag == PressFlag.R)
                            this.trackInfo.R2L(this._pickFrame);
                        else if (this._pickFrame.pressFlag == PressFlag.L)
                            this.trackInfo.L2L(this._pickFrame);
                    }
                }
                //console.log("mousemove", clip.position().left, appInfo.getMouseX());
            }
            //console.log(this, "startMoveTimer", self._timerId);

        }, 20);
    }

    stopMoveTimer() {
        if (this._timerId) {
            window.clearInterval(this._timerId);
            //console.log(this, "stopMoveTimer", this._timerId);
            this._timerId = 0;
        }
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    }

    remove() {
        console.log(this, "remove track idx:", this.trackInfo.idx);
        $(this.el).remove();
    }

    hScrollTo(val:number) {
        $(this.id$ + " " + ElmClass$.TrackArea).scrollLeft(val);
    }
}