/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;
    _isPressBar:boolean;
    _isPressClip:boolean;
    _lastX:number;
    timerId:number;
    _pickFrame:FrameInfo = null;

    constructor(trackInfo:TrackInfo) {
        super();
        this.trackInfo = trackInfo;
    }

    render() {
        var template = $('.Track-tpl').html();
        return Mustache.render(template, {
            //var newJade = jade.renderFile('ts/view/Track.jade',{
            idx: this.trackInfo.idx,
            name: this.trackInfo.name,
            frameIdxArr: this.trackInfo.getIdxArr(),
            //imgs: this.trackInfo.getImgs()
        });
    }

    //use for add Child view to parent
    setParent(parent:JQuery) {
        super.setParent(parent);

        var clipWidth = this.trackInfo.getEnd() * appInfo.projectInfo.frameWidth;
        var idx = this.trackInfo.idx;
        this.id$ = ElmClass$.Track + "#" + idx;
        this.el = $(this.id$)[0];
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        var barHeight = $(this.id$ + " " + ElmClass$.Bar).height();
        clip.width(clipWidth);

        clip.on(MouseEvt.DOWN, (e)=> {
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
                console.log("Pick frame", e.clientX, mouseX, frameInfo, frameInfo.getIdx());
            }
            this.startMoveTimer();
            console.log("down", this._isPressBar, mouseY, barHeight);
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

        $(this.id$).on(MouseEvt.DOWN, ()=> {
            if (this.trackInfo.isSelected && !this._isPressClip)
                this.setSelected(false);
            else
                this.trackInfo.dis(ActEvent.SEL_TRACK, this.trackInfo);
        });
        this.initFrame();
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
            var frameWidth = appInfo.projectInfo.curComp.frameWidth;
            var frame$ = $(this.getFrameId$(pickFrame.getIdx()));
            frame$.width(frame$.width() + frameWidth);
            for (var i = pickFrame.getIdx() + 1; i < this.trackInfo.getImgs().length; i++) {
                var nextframe$ = $(this.getFrameId$(i + 1));
                nextframe$.css({left: nextframe$.position().left + frameWidth});
            }
        });
    }

    getFrameId$(idx) {
        return "#" + ElmClass$.TrackCls + this.trackInfo.idx + ElmClass$.Frame + (idx + 1)
    }

    onUp() {
        this._isPressBar = false;
        this._isPressClip = false;
        this._pickFrame = null;
        this.stopMoveTimer();
    }

    setSelected(val:boolean) {
        this.trackInfo.isSelected = val;
        if (val)//todo light color
            this.setColor("#666");
        else
            this.setColor("#444");
        console.log(this, 'set selected ', val, this.trackInfo.idx);
    }

    startMoveTimer() {
        this.timerId = window.setInterval(()=> {
            var clip = $(this.id$ + " " + ElmClass$.Clip);
            if (this._isPressClip) {
                var dx = appInfo.mouseX - this._lastX;
                if (dx > 30) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.setStart(this.trackInfo.getStart() + 1);
                        clip.css({left: clip.position().left + appInfo.projectInfo.curComp.frameWidth});
                    } else if (this._pickFrame) {
                        this.trackInfo.R2R(this._pickFrame);
                    }
                }
                else if (dx < -30) {
                    this._lastX = appInfo.mouseX;
                    if (this._isPressBar) {
                        this.trackInfo.setStart(this.trackInfo.getStart() - 1);
                        clip.css({left: clip.position().left - appInfo.projectInfo.curComp.frameWidth});
                    }
                }
                //console.log("mousemove", clip.position().left, appInfo.getMouseX());
            }
            //console.log(this, "startMoveTimer", self.timerId);

        }, 20);
    }

    stopMoveTimer() {
        if (this.timerId) {
            window.clearInterval(this.timerId);
            //console.log(this, "stopMoveTimer", this.timerId);
            this.timerId = 0;
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