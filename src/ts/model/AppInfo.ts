/// <reference path="ProjectInfo.ts"/>
/// <reference path="TheMachine.ts"/>
/// <reference path="../event/ActEvent.ts"/>

class AppInfo extends EventDispatcher {
    projectInfo:ProjectInfo;
    tm:TheMachine;
    mouseX:number;
    mouseY:number;

    constructor() {
        super();
    }


    newProject() {
        this.projectInfo = new ProjectInfo();
        this.dis("newProject");
        this.tm = new TheMachine();

    }

    test() {
        this.newProject();
        $("#btnTest").on(MouseEvt.CLICK, ()=> {
            this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
            console.log(this, "test");
        });
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        this.projectInfo.curComp.newTrack('D:/projects/animk/test/test10');
        this.projectInfo.curComp.setCursor(1);
    }


    frameWidth() {
        return this.projectInfo.curComp.frameWidth
    }
}

var appInfo = new AppInfo();