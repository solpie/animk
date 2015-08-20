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
        this.projectInfo.newComp().newTrack('D:/projects/linAnil/test/test10');
    }
}

var appInfo = new AppInfo();