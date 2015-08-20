/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../model/AppInfo.ts"/>

class TrackView implements IBaseView {
    trackInfo:TrackInfo;
    el:HTMLElement;

    constructor(trackInfo:TrackInfo) {
        this.trackInfo = trackInfo;
    }

    render() {
        if (!this.el) {
            this.el = $('<div class="track">track_' + this.trackInfo.idx + '</div>').data('idx', this.trackInfo.idx);
        }
        var self = this;
        $(this.el).on("click", function () {
            self.onDelTrack();
        });
        return this.el;
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    }

    remove() {
        console.log(this, "remove1");
        $(this.el).remove();
    }

}