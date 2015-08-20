/// <reference path="BaseView.ts"/>

class TimelineView extends BaseView {
    constructor() {
        super();

        this.setElement("#timeline");
        var instance = this;

        $("#newTrack").on("click", function () {
            instance.onNewTrack();
        });
    }

    onNewTrack() {
        console.log("on click");
        var appModel = $("#app").data("appModel");
        appModel.projectInfo.curComp.newTrack();
    }
}