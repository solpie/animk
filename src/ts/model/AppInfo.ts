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
        this.tm = new TheMachine();
    }


    newProject() {
        this.projectInfo = new ProjectInfo();
        this.dis(ProjectInfoEvent.NEW_PROJ);
    }

    openProject(path) {
        this.projectInfo = new ProjectInfo();
        this.dis(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.open(path);
        //this.projectInfo.curComp.setCursor(1);
    }

    test() {
        //this.newProject();
        //$("#btnTest").on(MouseEvt.CLICK, ()=> {
        //    this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
        //    console.log(this, "test");
        //});
        //this.projectInfo.newComp(1280,720,24).newTrack('D:/projects/animk/test/test30');
        //this.projectInfo.curComp.newTrack('D:/projects/animk/test/test10');
        //this.projectInfo.curComp.setCursor(1);

        //this.projectInfo = new ProjectInfo();
        //this.dis(ProjectInfoEvent.NEW_PROJ);
        //this.projectInfo.open('../test/data.json');

        //this.projectInfo.save('D:/projects/animk/test/data.json')
    }


    frameWidth() {
        return this.projectInfo.curComp.frameWidth
    }
}

var appInfo = new AppInfo();