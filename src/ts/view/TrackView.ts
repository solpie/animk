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
            idx: this.trackInfo.idx2(),
            name: this.trackInfo.name(),
            frameIdxArr: this.trackInfo.getIdxArr(),
        });
    }

    setActFrame(frameIdx) {
        console.log(this, "SEL_FRAME", frameIdx, this.id$);
        var focusHint = $(this.id$ + " " + ElmClass$.FocusHint);
        if (frameIdx) {
            var frameInfo:FrameInfo = this.trackInfo.frameInfoArr[frameIdx];
            if (frameInfo) {
                focusHint.css({left: (frameInfo.getStart() - 1) * appInfo.frameWidth()});
                focusHint.css({display: "block"});
                appInfo.tm.ActFrameInfo = frameInfo;
            }
        }
        else {
            focusHint.css({display: "none"})
        }
    }

    //use for add Child view to parent
    setParent(parent:JQuery) {
        super.setParent(parent);
        this.bindTrackInfoEvent();

        var idx = this.trackInfo.idx2();
        this.id$ = ElmClass$.Track + "#" + idx;


        this._slider = new Slider(this.id$ + " " + ElmClass$.Slider);
        this._slider.on(ViewEvent.CHANGED, (val)=> {
            this.onSlider(val);
        });
        /// track menu
        this._initMenu();
        $(this.id$ + " " + ElmClass$.CheckBox).on(MouseEvt.DOWN, ()=> {
            this.trackInfo.enable(!this.trackInfo.enable());
        });
        ////////////////     track name input
        var trackName$ = $(this.id$ + " " + ElmClass$.Text);
        var trackInput$ = $(this.id$ + " " + ElmClass$.Input);


        trackInput$.on(ViewEvent.CHANGED, ()=> {
            var newName = trackInput$.val();
            this.trackInfo.name(newName);
        });

        trackName$.on(MouseEvt.DBLCLICK, ()=> {
            this.showTrackRenameInput();
        });
        //////////////////////////////////////////////
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clipWidth = this.trackInfo.getHold() * frameWidth;
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

        $(this.id$).on(MouseEvt.DOWN, (e)=> {
            if (e.button == MouseButton.LEFT) {
                if (this.trackInfo.isSelected && !this._isPressWidget)
                    this.setSelected(false);
                else
                    this.trackInfo.emit(TrackInfoEvent.SEL_TRACK, this.trackInfo);
            }

        });
        this._initFrame();
        this._initView();
    }

    _initView() {
        this.onSetOpacity();
        this._updateActHint()
    }

    _initMenu() {
        var panel$ = this.id$ + " " + ElmClass$.Panel;
        $(panel$).on(MouseEvt.RCLICK, ()=> {
            if (!this.trackInfo.isSelected) {
                this.trackInfo.emit(TrackInfoEvent.SEL_TRACK, this.trackInfo);
            }
            this._isPressWidget = true;
            cmd.emit(CommandId.ShowTrackMenu);
        });

    }

    _updateActHint() {
        var type = this.trackInfo.actType();
        var actHint$ = $(this.id$ + " " + ElmClass$.ActHint);
        if (type == ImageTrackActType.NOEDIT) {
            actHint$.css({background: ColorTheme.IMAGE_ACT_NOEDIT});
        }
        else if (type == ImageTrackActType.NORMAL) {
            actHint$.css({background: ColorTheme.IMAGE_ACT_NORMAL});
        }
        else if (type == ImageTrackActType.REF) {
            actHint$.css({background: ColorTheme.IMAGE_ACT_REF});
        }
    }

    showTrackRenameInput() {
        var trackInput$ = $(this.id$ + " " + ElmClass$.Input);
        trackInput$.val(this.trackInfo.name());
        trackInput$.css({display: "block"});
        trackInput$.focus();
        KeyInput.isBlock = true;
        trackInput$.on(KeyEvt.DOWN, (e)=> {
            if (Keys.ESC(e.keyCode) || Keys.Char(e.keyCode, "\r")) {
                KeyInput.isBlock = false;
                trackInput$.css({display: "none"});
                trackInput$.unbind(KeyEvt.DOWN);
            }
        });
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

    bindTrackInfoEvent() {
///  trackInfo event
        //////// opacity slider
        //this.trackInfo.removeAll();
        this.trackInfo.on(TrackInfoEvent.SET_OPACITY, ()=> {
            this.onSetOpacity();
        });
        //////// visible checkbox
        this.trackInfo.on(TrackInfoEvent.SET_ENABLE, ()=> {
            this.onVisible();
        });

        var trackName$ = $(this.id$ + " " + ElmClass$.Text);
        this.trackInfo.on(TrackInfoEvent.SET_NAME, (name)=> {
            trackName$.html(name);
        });

        this.trackInfo.on(TrackInfoEvent.SET_ACT_TYPE, (v)=> {
            this._updateActHint();
        });
        var frameWidth = appInfo.frameWidth();
        this.trackInfo.on(TrackInfoEvent.LOADED, ()=> {
            this._frameView.resize(this.trackInfo.getHold() * frameWidth, -1);
            this._frameView.updateFrame(this.trackInfo.frameInfoArr);
            appInfo.emit(TheMachineEvent.UPDATE_IMG);
        });

        this.trackInfo.on(TrackInfoEvent.DEL_FRAME, (delFrame:FrameInfo)=> {
            this.onDelFrame(delFrame);
        });
    }

    _initFrame() {
        var frameWidth = appInfo.frameWidth();
        this._frameView = new FrameView(ElmClass$.FrameCanvas$ + this.trackInfo.idx2() + "");
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
        var frameWidth = appInfo.frameWidth();
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        clip.css({left: this.trackInfo.start() * frameWidth - appInfo.projectInfo.curComp.hScrollVal});
        //clip.width((this.trackInfo.getHold()) * frameWidth);
    }

    onDelFrame(delFrame:FrameInfo) {
        this.updateClip();
    }

    onUp() {
        this._isPressBar = false;
        this._isPressWidget = false;
        if (this._pickFrame) {
            this.trackInfo.emit(TrackInfoEvent.SEL_FRAME, [this.trackInfo.idx2(), this._pickFrame.getIdx()]);
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
                        this.trackInfo.start(this.trackInfo.start() + 1);
                        clip.css({left: clip.position().left + frameWidth});
                    } else if (this._pickFrame) {
                        this.onPickFrame(true);
                    }
                }
                else if (dx < -frameWidth) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.start(this.trackInfo.start() - 1);
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


    hScrollTo(val:number) {
        $(this.id$ + " " + ElmClass$.TrackArea).scrollLeft(val);
    }
}