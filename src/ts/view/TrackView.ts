/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView  {
    trackInfo:TrackInfo;
    el:HTMLElement;

    constructor(trackInfo:TrackInfo) {
        super();
        this.trackInfo = trackInfo;
    }

    render(fileArr:Array<string>):HTMLElement {
        //if (!this.el) {
        var track = $("<div class='Track'/>");
        var trackPanel = $('<div class="Panel"/>');
        track.append(trackPanel);
        var nameLabel = $("<div class='Label'/>");
        nameLabel.html("track#" + this.trackInfo.idx);
        trackPanel.append(nameLabel);
        var trackClip = $('<div class="Clip"/>');
        var trackBar = $('<div class="Bar"/>');
        trackClip.append(trackBar);
        fileArr = this.trackInfo.imgArr;
        for (var i = 0; i < fileArr.length; i++) {
            var trackFrame = $('<div class="Frame"/>');
            var frameImg = $('<img src="' + fileArr[i] + '"/>');
            trackFrame.append(frameImg);
            trackClip.append(trackFrame);
        }
        trackClip.width(fileArr.length * 40);
        track.append(trackClip);
        this.el = track;
        var self = this;
        $(this.el).on("click", function () {
            self.onDelTrack();
        });
        //trackClip.width(1400);
        return track;
    }

    render1() {
        var template = $('.Track-tpl').html();
        var newTrack = Mustache.render(template, {name: this.trackInfo.name, imgs: this.trackInfo.imgArr});
        return newTrack;
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    }

    remove() {
        console.log(this, "remove1");
        $(this.el).remove();
    }

}