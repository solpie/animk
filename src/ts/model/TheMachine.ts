/// <reference path="../event/ActEvent.ts"/>
/// <reference path="AppInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
/// <reference path="../JQuery.ts"/>
var exec = require('child_process').exec;

class TheMachine extends EventDispatcher {
    actImg:string;
    ActFrameInfo:FrameInfo;
    watchArr:Array<FrameInfo>;
    _updateCount:number = 0;//for clear cache
    constructor() {
        super();
        this.watchArr = [];
    }

    updateWatchArr() {
        this._updateCount++;
        for (var i = 0; i < this.watchArr.length; i++) {
            var frameInfo:FrameInfo = this.watchArr[i];
            frameInfo.imageInfo.reloadImg();
            $(frameInfo.id$).attr("src", frameInfo.imageInfo.filename + "?fc=" + this._updateCount);
        }
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    }

    watchAct() {
        if (this.ActFrameInfo) {
            if (this.watchArr.indexOf(this.ActFrameInfo) > -1) {
                console.log(this, "watching");
            }
            else {
                this.watchArr.push(this.ActFrameInfo);
                this.dis(TheMachineEvent.ADD_IMG);
            }
            this.open(this.ActFrameInfo.imageInfo.filename);
        }
    }

    open(path:string) {
        path = path.replace("/", "\\");
        console.log(this, "open:", path);
        exec('"C:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
            if (stdout) {
                console.log('stdout: ' + stdout);
            }
            if (stderr) {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('Exec error: ' + error);
            }
        });
    }
}