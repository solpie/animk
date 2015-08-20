/// <reference path="BaseView.ts"/>

class TimelineView extends BaseView {
    constructor() {
        super();

        var self = this;
        $("#btnNewTrack").on("click", function () {
            self.onNewTrack();
        });
    }

    onNewTrack() {

        chooseFile('#fileDialog').change(function (e) {
            var path = $(this).val();
            var reg = /(.+)\\.+\.png/g;
            var a = reg.exec(path);
            if (a.length > 1) {
                var folder = a[1];
                var appModel = $("#app").data("appModel");
                appModel.projectInfo.curComp.newTrack(folder);
                console.log(this, path, a[0], a[1]);
            }

        });

        console.log(this, "onNewTrack");

    }
}