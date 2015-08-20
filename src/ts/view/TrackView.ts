/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView extends BaseView implements IBaseView {
    trackInfo:TrackInfo;
    el:HTMLElement;

    constructor(trackInfo:TrackInfo) {
        super();
        this.trackInfo = trackInfo;
    }

    render(fileArr:Array<string>):HTMLElement {
        //if (!this.el) {
        var track = $("<div class='Track'/>");
        var nameLabel = $("<div class='Label'/>");
        nameLabel.html("track#" + this.trackInfo.idx);
        track.append(nameLabel);
        var trackClip = $('<div class="TrackClip"/>');
        var trackBar = $('<div class="Bar"/>');
        trackClip.append(trackBar);
        for (var i = 0; i < fileArr.length; i++) {
            var trackFrame = $('<div class="trackFrame"/>');
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

    onDelTrack() {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    }

    remove() {
        console.log(this, "remove1");
        $(this.el).remove();
    }

}