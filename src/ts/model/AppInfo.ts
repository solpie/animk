/// <reference path="ProjectInfo.ts"/>
/// <reference path="SettingInfo.ts"/>
/// <reference path="tm/TheMachine.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../util/png/PngMaker.ts"/>
/// <reference path="../util/psd/PsdMaker.ts"/>
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
        //this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
        //console.log(this, "test");

        //var pnglib = new PngMaker();
        //pnglib.createPng(300, 300);
        //var psd = new PsdMaker();

        //cmd.on(CommandId.OpenOnHoldWin, ()=> {
        //
        //});

        cmd.on(CommandId.testSwapTrack, ()=> {
            this.projectInfo.curComp.swapTrack(2, 1);
        });

        cmd.on(CommandId.testProject, ()=> {
            this.projectInfo.open('../test/data.json');
        });

        cmd.on(CommandId.testSaveProject, ()=> {
            this.projectInfo.save('D:/projects/animk/test/data.json')
        });
        cmd.on(CommandId.testNewProject, ()=> {
            this.newProject();
            this.projectInfo.newComp(1280, 720, 24).newTrack('D:/projects/animk/test/test30');
            this.projectInfo.curComp.newTrack('D:/projects/animk/test/test10');
            this.projectInfo.curComp.setCursor(1);
        });
    }

    frameWidth() {
        return this.projectInfo.curComp.frameWidth
    }
}

var appInfo = new AppInfo();