/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../app.ts"/>

class TrackView implements IBaseView {
    trackInfo:TrackInfo;
    el:HTMLElement;

    constructor(idx:number) {
        this.trackInfo = new TrackInfo();
        this.trackInfo.idx = idx;
    }

    render() {
        if (!this.el) {
            this.el = $('<div class="track">track_' + this.trackInfo.idx + '</div>').data('idx', this.trackInfo.idx);
        }
        var instance = this;
        $(this.el).on("click", function () {
            //var appView = $("#root").data("app");
            //appView.projectInfo.curComp.delTrack(instance.trackInfo.idx);
            appModel.projectInfo.curComp.delTrack(instance.trackInfo.idx);
        });
        return this.el;
    }

    remove() {
        console.log(this, "remove1");
        $(this.el).remove();
    }

}