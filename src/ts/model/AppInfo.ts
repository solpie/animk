/// <reference path="ProjectInfo.ts"/>
/// <reference path="SettingInfo.ts"/>
/// <reference path="TheMachine.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../util/png/PngMaker.ts"/>
class AppInfo extends EventDispatcher {
    projectInfo:ProjectInfo;
    tm:TheMachine;
    settingInfo:SettingInfo;
    mouseX:number;
    mouseY:number;

    constructor() {
        super();
        this.tm = new TheMachine();
        this.settingInfo = new SettingInfo();
    }


    newProject() {
        this.projectInfo = new ProjectInfo();
        this.emit(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.newComp(1280, 720, 24);
        this.projectInfo.curComp.setCursor(1);

    }

    openProject(path) {
        this.projectInfo = new ProjectInfo();
        this.emit(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.open(path);

        //this.projectInfo.curComp.setCursor(1);
    }


    test(test?) {
        $("#btnTest").on(MouseEvt.CLICK, ()=> {
            //this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
            //console.log(this, "test");
            {//test project
                this.newProject();
                this.projectInfo.newComp(1280, 720, 24).newTrack('D:/projects/animk/test/test30');
                this.projectInfo.curComp.newTrack('D:/projects/animk/test/test10');
                this.projectInfo.curComp.setCursor(1);
            }
        });

        //var pnglib = new PngMaker();
        //pnglib.createPng(300, 300);


        //this.projectInfo = new ProjectInfo();
        //this.dis(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.open('../test/data.json');

        //this.projectInfo.save('D:/projects/animk/test/data.json')

        //function loadUser() {
        //}
    }

    frameWidth() {
        return this.projectInfo.curComp.frameWidth
    }
}

var appInfo = new AppInfo();