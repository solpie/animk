/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    clip:HTMLElement;

    constructor(trackInfo:TrackInfo) {
        super();
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

        var clipWidth = this.trackInfo.imgArr.length * appInfo.projectInfo.frameWidth;
        var idx = this.trackInfo.idx;
        this.el = $(".Track#" + idx)[0];
        var clip = $(".Track#" + idx + " .Clip");
        clip.width(clipWidth);
        clip.on('mousemove', function (e) {
            console.log("mousemove", e.clientX, e.clientY);
        });
        clip.on('mousedown', function (e) {
            console.log("down", "");
        });
        clip.on('mouseup', function (e) {
            console.log("mouseup", "");
        });
        console.log(this, "setParent2", clip, clipWidth);

        var self = this;
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