/// <reference path="BaseView.ts"/>

class TimelineView extends BaseView {
    constructor() {
        super();
        this.el = $("#timeline");
        $("#btnNewTrack").on(MouseEvt.CLICK, ()=> {
            this.onNewTrack();
        });
        $("#btnDelTrack").on(MouseEvt.CLICK, ()=> {
            this.onDelTrack();
        });

        this.initDrag();
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delSelTrack();
        console.log("onDelSelTrack ")
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

        var timeline = document.getElementById(TimelineId);
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
            var file = e.dataTransfer.files[0];
            if (file.path) {
                self.newTrackByFilename(file.path);
                console.log(this, "ondrop", file.path);
            }
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

    resize(w:number, h:number) {
        if (h != -1) {
            var trackToolBarHeight = $(TrackToolId$).height();
            var timeline = $(TimelineId$);
            timeline.height(h);
            var vScrollBar = $(VScrollBarId$);

            //vScrollBar.css({top: $(ViewportId$).position().bottom + trackToolBarHeight});
            vScrollBar.css({top: timeline.position().top + trackToolBarHeight});
            var compositionHeight = h - trackToolBarHeight;
            vScrollBar.height(compositionHeight);
            $(CompositionId$).height(compositionHeight);
        }
    }
}