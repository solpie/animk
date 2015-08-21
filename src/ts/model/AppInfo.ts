/// <reference path="ProjectInfo.ts"/>
class AppInfo extends EventDispatcher {
    projectInfo:ProjectInfo;
    mouseX:number;
    mouseY:number;

    constructor() {
        super();
        var self = this;
        document.onmousemove = function (e) {
            self.mouseX = e.clientX;
            self.mouseY = e.clientY;
        };
        document.onmouseup = function(){
            $("body").css("-webkit-app-region", "none");
        };
    }


    newProject() {
        this.projectInfo = new ProjectInfo();
        this.dis("newProject");
    }

    test() {
        this.newProject();
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test10');
        //this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        //this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        //this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        //this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
    }
}

var appInfo = new AppInfo();