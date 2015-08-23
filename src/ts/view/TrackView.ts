/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;
    _isPress:boolean;
    _lastX:number;
    timerId:number;

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
            imgs: this.trackInfo.getImgs()
        });
    }

    //use for add Child view to parent
    setParent(parent:JQuery) {
        super.setParent(parent);

        var clipWidth = this.trackInfo.imgInfoArr.length * appInfo.projectInfo.frameWidth;
        var idx = this.trackInfo.idx;
        this.id$ = ElmClass$.Track + "#" + idx;
        this.el = $(this.id$)[0];
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        clip.width(clipWidth);

        clip.on(MouseEvt.DOWN, ()=> {
            this._isPress = true;
            this._lastX = appInfo.mouseX;
            this.startMoveTimer();
            console.log("down", this._isPress);
        });

        clip.on(MouseEvt.UP, ()=> {
            this._isPress = false;
            this.stopMoveTimer();
            //console.log("mouseup", "");
        });
        //clip.on(MouseEvt.LEAVE, (e)=> {
        //    //self._isPress = false;
        //    //self.stopMoveTimer();
        //    //console.log("mouseleave", "");
        //});

        appInfo.add(MouseEvt.UP, ()=> {
            this._isPress = false;
            this.stopMoveTimer();
        });

        this.setColor('#444');
        console.log(this, "setParent2", clip, clipWidth);

        $(this.id$).on(MouseEvt.DOWN, ()=> {
            if (this.trackInfo.isSelected && !this._isPress)
                this.setSelected(false);
            else
                this.trackInfo.dis(ActEvent.SEL_TRACK, this.trackInfo);
        })
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
            if (this._isPress) {
                var dx = appInfo.mouseX - this._lastX;
                if (dx > 30) {
                    this._lastX = appInfo.mouseX;
                    this.trackInfo.setStartFrame(this.trackInfo.getStartFrame() + 1);
                    clip.css({left: clip.position().left + appInfo.projectInfo.curComp.frameWidth});
                }
                else if (dx < -30) {
                    this._lastX = appInfo.mouseX;
                    this.trackInfo.setStartFrame(this.trackInfo.getStartFrame() - 1);
                    clip.css({left: clip.position().left - appInfo.projectInfo.curComp.frameWidth});
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