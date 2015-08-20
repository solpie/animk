/// <reference path="BaseView.ts"/>

class TimelineView extends BaseView {
    constructor() {
        super();

        var self = this;
        $("#newTrack").on("click", function () {
            self.onNewTrack();
        });
    }

    onNewTrack() {
        console.log("on click");
        var appModel = $("#app").data("appModel");
        appModel.projectInfo.curComp.newTrack();
    }
}