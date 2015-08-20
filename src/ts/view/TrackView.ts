/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;

    constructor(trackInfo:TrackInfo) {
        super();
        this.trackInfo = trackInfo;
    }

    render() {
        var template = $('.Track-tpl').html();
        var newTrack = Mustache.render(template, {
            idx: this.trackInfo.idx,
            name: this.trackInfo.name,
            imgs: this.trackInfo.imgArr
        });
        return newTrack;
    }

    setParent(parent:JQuery) {
        var track$ = parent.append(this.render());
        var clipWidth = this.trackInfo.imgArr.length * appInfo.projectInfo.frameWidth;
        var idx = this.trackInfo.idx;
        this.el = $(".Track#" + idx)[0];
        var clip = $(".Track#" + idx + " .Clip");
        clip.width(clipWidth);
        console.log(this, "setParent", track$, clip, clipWidth);

        var self = this;
        $(this.el).on('click', function () {
            self.onDelTrack();
        })
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    }

    remove() {
        console.log(this, "remove track idx:", this.trackInfo.idx);
        $(this.el).remove();
    }

}