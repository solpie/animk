/// <reference path="BaseView.ts"/>
/// <reference path="TimestampView.ts"/>
interface File {
    path:string;
}
class TimelineView extends BaseView {
    _timestamp:TimestampView;

    constructor() {
        super();
        $(ElmId$.btnImportTrack).on(MouseEvt.CLICK, ()=> {
            this.onNewTrack();
        });
        $(ElmId$.btnNewTrack).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.ShowNewPngWin);
        });
        $(ElmId$.btnDelTrack).on(MouseEvt.CLICK, ()=> {
            this.onDelTrack();
        });
        $(ElmId$.btnUpdate).on(MouseEvt.CLICK, ()=> {
            this.updateImg();
        });

        cmd.on(CompInfoEvent.FRAME_WIDTH_CHANGE, ()=> {
            this._updateCursor();
        });

        this.initDrag();

        this._timestamp = new TimestampView();
    }

    _updateCursor() {
        console.log(this, "updateCursor width: ",appInfo.frameWidth());
        $(ElmId$.cursor).width(appInfo.frameWidth());
    }

    updateImg() {
        appInfo.tm.updateWatchArr();
    }

    onDelTrack() {
        appInfo.projectInfo.curComp.delSelTrack();
        console.log("onDelSelTrack ")
    }

    onNewTrack() {
        chooseFile(ElmId$.newTrackDialog).change(()=> {
            var val = $(ElmId$.newTrackDialog).val();
            if (val) {
                this.newTrackByFilename(val);
                $(ElmId$.newTrackDialog).val("")
            }
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
            //console.log(this, "dragOver");
            return false;
        };
        timeline.ondragleave = function () {
            //this.className = '';
            return false;
        };
        timeline.ondrop = (e)=> {
            e.preventDefault();
            var file:File = e.dataTransfer.files[0];
            if (file.path) {
                this.newTrackByFilename(file.path);
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
            //vScrollBar.css({top: timeline.position().top + trackToolBarHeight});
            var compositionHeight = h - trackToolBarHeight;
            vScrollBar.height(compositionHeight);
            $(CompositionId$).height(compositionHeight);
            $(ElmId$.cursorMask).height(compositionHeight + trackToolBarHeight);
        }
        if (w != -1) {
            var trackToolBarWidth = $(TrackToolId$).width();
            $(HScrollBarId$).width(w - 200);
            $(ElmId$.cursorMask).width(w);
            this._timestamp.resize(w, -1);
        }
    }
}