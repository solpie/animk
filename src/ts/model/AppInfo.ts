/// <reference path="ProjectInfo.ts"/>
class AppInfo extends EventDispatcher {
    projectInfo:ProjectInfo;

    constructor() {
        super();
    }

    newProject() {
        this.projectInfo = new ProjectInfo();
        this.dis("newProject");
    }

    test() {
        this.newProject();
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test10');
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
        this.projectInfo.newComp().newTrack('D:/projects/animk/test/test30');
    }
}

var appInfo = new AppInfo();