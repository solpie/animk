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
        this.className = "Track";
        this.trackInfo = trackInfo;
    }

    render() {
        var template = $('.Track-tpl').html();
        var newTrack = Mustache.render(template, {
            //var newJade = jade.renderFile('ts/view/Track.jade',{
            idx: this.trackInfo.idx,
            name: this.trackInfo.name,
            imgs: this.trackInfo.imgArr
        });
        //var newJade = jade.renderFile('jade/Track.jade', {
        //    idx: this.trackInfo.idx,
        //    name: this.trackInfo.name,
        //    imgs: this.trackInfo.imgArr
        //});
        return newTrack;
    }

    //use for add Child view to parent
    setParent(parent:JQuery) {
        super.setParent(parent);
        var self = this;

        var clipWidth = this.trackInfo.imgArr.length * appInfo.projectInfo.frameWidth;
        var idx = this.trackInfo.idx;
        this.id$ = "." + this.className + "#" + idx;
        this.el = $(this.id$)[0];
        var clip = $(this.id$ + " .Clip");
        clip.width(clipWidth);

        clip.on('mousedown', function (e) {
            //clip.css({left: 40});
            self._isPress = true;
            self._lastX = appInfo.mouseX;
            self.startMoveTimer();
            console.log("down", self._isPress);
        });
        clip.on('mouseup', function (e) {
            self._isPress = false;
            self.stopMoveTimer();
            //console.log("mouseup", "");
        });
        clip.on('mouseleave', function (e) {
            //self._isPress = false;
            self.stopMoveTimer();

            //console.log("mouseleave", "");
        });

        this.setColor('#444');
        console.log(this, "setParent2", clip, clipWidth);

        $(this.id$).on('click', ()=> {
            this.trackInfo.dis(ActEvent.SEL_TRACK, this.trackInfo);
        })
    }

    setSelected(val:boolean) {
        this.trackInfo.isSelected = val;
        if (val)
            this.setColor("#666")
        else
            this.setColor("#444")
        console.log(this, 'set selected ', val, this.trackInfo.idx);
    }

    startMoveTimer() {
        var self = this;
        self.timerId = window.setInterval(function () {
            var clip = $(self.id$ + " .Clip");
            if (self._isPress) {
                var dx = appInfo.mouseX - self._lastX;
                if (dx > 30) {
                    self._lastX = appInfo.mouseX;
                    clip.css({left: clip.position().left + appInfo.projectInfo.frameWidth});
                }
                else if (dx < -30) {
                    self._lastX = appInfo.mouseX;
                    clip.css({left: clip.position().left - appInfo.projectInfo.frameWidth});
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

}