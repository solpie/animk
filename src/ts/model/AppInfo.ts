/// <reference path="ProjectInfo.ts"/>
class AppInfo extends EventDispatcher {
    projectInfo:ProjectInfo;
    mouseX:number;
    mouseY:number;

    constructor() {
        super();
    }


    newProject() {
        this.projectInfo = new ProjectInfo();
        this.dis("newProject");
    }

    test() {
        this.newProject();
        $("#btnTest").on(MouseEvt.CLICK, ()=> {
            this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
            console.log(this, "test");
        });
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test10');
        //this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
    }
}

var appInfo = new AppInfo();