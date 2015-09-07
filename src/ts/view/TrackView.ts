/// <reference path="BaseView.ts"/>
/// <reference path="FrameView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../model/AppInfo.ts"/>
/// <reference path="../widget/Slider.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;
    _isPressBar:boolean;
    _isPressWidget:boolean;
    _lastX:number;
    _timerId:number;
    _pickFrame:FrameInfo = null;
    _frameView:FrameView;
    _slider:Slider;

    constructor(trackInfo:TrackInfo) {
        super();
        this.trackInfo = trackInfo;
    }

    render() {
        var template = $('.Track-tpl').html();
        return Mustache.render(template, {
            idx: this.trackInfo.idx,
            name: this.trackInfo.name(),
            frameIdxArr: this.trackInfo.getIdxArr(),
            //imgs: this.trackInfo.getImgs()
        });
    }

    setActFrame(frameIdx) {
        console.log(this, "SEL_FRAME", frameIdx, this.id$);
        var actHint = $(this.id$ + " " + ElmClass$.ActHint);
        if (frameIdx) {
            var frameInfo:FrameInfo = this.trackInfo.frameInfoArr[frameIdx];
            //actHint.css({top: 65});
            if (frameInfo) {
                actHint.css({left: (frameInfo.getStart() - 1) * appInfo.frameWidth()});
                actHint.css({display: "block"});
                appInfo.tm.ActFrameInfo = frameInfo;
            }
        }
        else {
            actHint.css({display: "none"})
        }
    }

    //use for add Child view to parent
    setParent(parent:JQuery) {
        super.setParent(parent);

        var idx = this.trackInfo.idx;
        this.id$ = ElmClass$.Track + "#" + idx;
        ///  trackInfo event
        //////// opacity slider
        this.trackInfo.on(TrackInfoEvent.SET_OPACITY, ()=> {
            this.onSetOpacity();
        });

        this._slider = new Slider(this.id$ + " " + ElmClass$.Slider);
        this._slider.on(ViewEvent.CHANGED, (val)=> {
            this.onSlider(val);
        });

        //////// visible checkbox
        this.trackInfo.on(TrackInfoEvent.SET_ENABLE, ()=> {
            this.onVisible();
        });
        $(this.id$ + " " + ElmClass$.CheckBox).on(MouseEvt.DOWN, ()=> {
            this.trackInfo.enable(!this.trackInfo.enable());
        });
        ////////////////     track name input
        var trackName$ = $(this.id$ + " " + ElmClass$.Text);
        var trackInput$ = $(this.id$ + " " + ElmClass$.Input);
        this.trackInfo.on(TrackInfoEvent.SET_NAME, (name)=> {
            trackName$.html(name);
        });
        trackInput$.on(ViewEvent.CHANGED, ()=> {
            var newName = trackInput$.val();
            this.trackInfo.name(newName);
        });
        trackName$.on(MouseEvt.DBLCLICK, ()=> {
            trackInput$.val(this.trackInfo.name());
            trackInput$.css({display: "block"});
            trackInput$.focus();
            trackInput$.on(KeyEvt.DOWN, (e)=> {
                if (Keys.Char(e.keyCode, "\r")) {
                    trackInput$.css({display: "none"});
                    trackInput$.unbind(KeyEvt.DOWN);
                }
            });
        });
        //////////////////////////////////////////////
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clipWidth = this.trackInfo.getHold() * frameWidth;
        this.el = $(this.id$)[0];
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        this.updateClip();

        clip.on(MouseEvt.DOWN, (e)=> {
            this.onMouseDown(e);
        });

        appInfo.on(MouseEvt.UP, ()=> {
            this.onUp();
        });

        this.setColor('#444');
        console.log(this, "setParent", clip, clipWidth);

        //todo MouseDown is duplicate
        $(this.id$).on(MouseEvt.DOWN, ()=> {
            if (this.trackInfo.isSelected && !this._isPressWidget)
                this.setSelected(false);
            else
                this.trackInfo.emit(TrackInfoEvent.SEL_TRACK, this.trackInfo);
        });
        this.initFrame();
    }

    onVisible() {
        if (this.trackInfo.enable())
            $(this.id$ + " " + ElmClass$.VisibleCheckBox).css({background: "#FAF014"});
        else
            $(this.id$ + " " + ElmClass$.VisibleCheckBox).css({background: "#333"});
        this._isPressWidget = true;
    }

    onSlider(val) {
        this.trackInfo.opacity(val);
        this._isPressWidget = true;
    }

    onMouseDown(e) {
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        var barHeight = $(this.id$ + " " + ElmClass$.Bar).height();
        this._lastX = appInfo.mouseX;
        var mouseY = e.clientY - $(this.id$).offset().top;
        this._isPressWidget = true;
        if (mouseY < barHeight) {
            this._isPressBar = true;
        }
        else if (!this._pickFrame) {
            var mouseX = e.clientX - clip.offset().left;
            var frameInfo = this.trackInfo.getPickFrameInfo(mouseX);
            this._pickFrame = frameInfo;
            if (this._pickFrame)
                console.log("Pick frame", mouseX, frameInfo, frameInfo.getIdx(), "Left", frameInfo.pressFlag);
        }
        this.startMoveTimer();
    }

    initFrame() {
        var frameWidth = appInfo.frameWidth();
        this.trackInfo.on(TrackInfoEvent.LOADED, ()=> {
            //this.trackInfo.getHold();
            this._frameView.resize(this.trackInfo.getHold() * frameWidth, -1);
            this._frameView.updateFrame(this.trackInfo.frameInfoArr);
            appInfo.emit(TheMachineEvent.UPDATE_IMG);
        });
        this.trackInfo.on(TrackInfoEvent.DEL_FRAME, (delFrame:FrameInfo)=> {
            this.onDelFrame(delFrame);
        });
        this._frameView = new FrameView(ElmClass$.FrameCanvas$ + this.trackInfo.idx + "");
        this._frameView.resize(frameWidth * this.trackInfo.frameInfoArr.length, frameWidth + 15);
        for (var i = 0; i < this.trackInfo.frameInfoArr.length; i++) {
            var frameInfo:FrameInfo = this.trackInfo.frameInfoArr[i];
            frameInfo.imageInfo.reloadImg();
        }

    }

    onSetOpacity() {
        this._slider.setBarWidth(this.trackInfo.opacity());
        appInfo.emit(TheMachineEvent.UPDATE_IMG)
    }

    updateClip() {
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        clip.css({left: this.trackInfo.getStart() * frameWidth - appInfo.projectInfo.curComp.hScrollVal});
        //clip.width((this.trackInfo.getHold()) * frameWidth);
    }

    onDelFrame(delFrame:FrameInfo) {
        $(this.getFrameId$(delFrame.getIdx())).remove();
        var isEnd = false;
        var idx = delFrame.getIdx();
        while (!isEnd) {
            var frame$ = $(this.getFrameId$(idx));
            if (frame$) {
                console.log(this, "delFrame", frame$.attr("id"));
                frame$.attr("id", this.getFrameId$(idx - 1));
                console.log(this, "delFrame", frame$.attr("id"));
                idx++;
                if (idx == 10)
                    isEnd = true;
            }
            else
                isEnd = true;
        }
        this.updateClip();
    }

    getFrameId$(idx) {
        return "#" + ElmClass$.TrackCls + this.trackInfo.idx + ElmClass$.Frame + (idx + 1)
    }

    onUp() {
        this._isPressBar = false;
        this._isPressWidget = false;
        if (this._pickFrame) {
            this.trackInfo.emit(TrackInfoEvent.SEL_FRAME, [this.trackInfo.idx, this._pickFrame.getIdx()]);
            this._pickFrame.pressFlag = 0;
        }
        this._pickFrame = null;
        this.trackInfo.clearRemoveFrame();
        this.stopMoveTimer();
    }

    setSelected(val:boolean) {
        this.trackInfo.isSelected = val;
        if (val)//todo light color
            this.setColor("#666");
        else
            this.setColor("#444");
    }

    onPickFrame(isMoveToRight) {
        if (isMoveToRight) {
            if (this._pickFrame.pressFlag == PressFlag.R) {
                this.trackInfo.R2R(this._pickFrame);
                this._frameView.updateFrame(this.trackInfo.frameInfoArr, 1);
            }
            else if (this._pickFrame.pressFlag == PressFlag.L) {
                this.trackInfo.L2R(this._pickFrame);
                this._frameView.updateFrame(this.trackInfo.frameInfoArr);
            }
        }
        else {
            if (this._pickFrame.pressFlag == PressFlag.R) {
                this.trackInfo.R2L(this._pickFrame);
                this._frameView.updateFrame(this.trackInfo.frameInfoArr, -1);
            }
            else if (this._pickFrame.pressFlag == PressFlag.L)
                this.trackInfo.L2L(this._pickFrame);
            this._frameView.updateFrame(this.trackInfo.frameInfoArr);
        }
    }

    startMoveTimer() {
        this._timerId = window.setInterval(()=> {
            var clip = $(this.id$ + " " + ElmClass$.Clip);
            if (this._isPressWidget) {
                var frameWidth = appInfo.projectInfo.curComp.frameWidth;
                var dx = appInfo.mouseX - this._lastX;
                if (dx > frameWidth) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.setStart(this.trackInfo.getStart() + 1);
                        clip.css({left: clip.position().left + frameWidth});
                    } else if (this._pickFrame) {
                        this.onPickFrame(true);
                    }
                }
                else if (dx < -frameWidth) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.setStart(this.trackInfo.getStart() - 1);
                        clip.css({left: clip.position().left - frameWidth});
                    } else if (this._pickFrame) {
                        this.onPickFrame(false);
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