/// <reference path="BaseView.ts"/>
/// <reference path="../Model/appInfo.ts"/>

class TimelineView extends BaseView {
    constructor() {
        super();
        this.el = $("#timeline");
        var self = this;
        $("#btnNewTrack").on("click", function () {
            self.onNewTrack();
        });

        this.initDrag();
    }

    onNewTrack() {
        var self = this;
        chooseFile('#fileDialog').change(function (e) {
            self.newTrackByFilename($(this).val());
        });
        console.log(this, "onNewTrack");
    }

    newTrackByFilename(filename) {
        var reg = /(.+)\\.+\.png/g;
        //todo unsupport type alert
        var a = reg.exec(filename);
        if (a.length > 1) {
            var folder = a[1];
            appInfo.projectInfo.curComp.newTrack(folder);
            console.log(this, filename, a[0], a[1]);
        }
    }

    initDrag() {
        window.ondragover = function (e) {
            e.preventDefault();
            return false
        };
        window.ondrop = function (e) {
            e.preventDefault();
            return false
        };

        var timeline = document.getElementById("timeline");
        timeline.ondragover = function () {
            //this.className = 'hover';
            console.log(this, "dragOver");
            return false;
        };
        timeline.ondragleave = function () {
            //this.className = '';
            return false;
        };
        var self = this;
        timeline.ondrop = function (e) {
            e.preventDefault();
            var file:File = e.dataTransfer.files[0];
            self.newTrackByFilename(file.path);
            console.log(this, "ondrop", file);
            //reader = new FileReader();
            //reader.onload = function (event) {
            //    console.log(event.target);
            //};
            //console.log(file);
            //var path = reader.readAsDataURL(file);
            //
            //return false;
        };
    }
}