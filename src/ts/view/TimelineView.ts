/// <reference path="BaseView.ts"/>

class TimelineView extends BaseView {
    constructor() {
        super();

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
            //var path = $(this).val();
            //var reg = /(.+)\\.+\.png/g;
            //var a = reg.exec(path);
            //if (a.length > 1) {
            //    var folder = a[1];
            //    var appModel = $("#app").data("appModel");
            //    appModel.projectInfo.curComp.newTrack(folder);
            //    console.log(this, path, a[0], a[1]);
            //}

        });
        console.log(this, "onNewTrack");
    }
    newTrackByFilename(filename){
        var reg = /(.+)\\.+\.png/g;
        var a = reg.exec(filename);
        if (a.length > 1) {
            var folder = a[1];
            var appModel = $("#app").data("appModel");
            appModel.projectInfo.curComp.newTrack(folder);
            console.log(this, filename, a[0], a[1]);
        }
    }
    initDrag() {
        // prevent default behavior from changing page on dropped file
        window.ondragover = function (e) {
            e.preventDefault();
            return false
        };
        window.ondrop = function (e) {
            e.preventDefault();
            return false
        };

        var holder = document.getElementById('timeline');
        holder.ondragover = function () {
            //this.className = 'hover';
            console.log(this, "dragOver");
            return false;
        };
        holder.ondragleave = function () {
            //this.className = '';
            return false;
        };
//    holder.ondrop = function (e) {
//        e.preventDefault();
//
//        for (var i = 0; i < e.dataTransfer.files.length; ++i) {
//            console.log(e.dataTransfer.files[i].path);
//        }
//        return false;
//    };
        var self = this;
        holder.ondrop = function (e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            self.newTrackByFilename(file.path);
            console.log(this, "ondrop",file.path);
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