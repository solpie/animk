/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;
    _isPress:boolean;
    _lastX:number;

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
        clip.on('mousemove', function (e) {
            if (self._isPress) {
                var dx = e.clientX - self._lastX;
                if (dx > 30) {
                    self._lastX = e.clientX;
                    clip.css({left: clip.position().left + appInfo.projectInfo.frameWidth});
                }
                else if (dx < -30) {
                    self._lastX = e.clientX;
                    clip.css({left: clip.position().left - appInfo.projectInfo.frameWidth});
                }
                console.log("mousemove", clip.position().left, e.clientY);
            }
        });
        clip.on('mousedown', function (e) {
            //clip.css({left: 40});
            self._isPress = true;
            self._lastX = e.clientX;
            //console.log("down", "");
        });
        clip.on('mouseup', function (e) {
            self._isPress = false;
            //console.log("mouseup", "");
        });
        clip.on('mouseleave', function (e) {
            self._isPress = false;
            //console.log("mouseleave", "");
        });
        console.log(this, "setParent2", clip, clipWidth);

        //$(this.el).on('click', function () {
        //    self.onDelTrack();
        //})
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    }

    remove() {
        console.log(this, "remove track idx:", this.trackInfo.idx);
        $(this.el).remove();
    }

}