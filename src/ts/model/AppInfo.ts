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
        this.projectInfo.newComp();
    }
}

var appInfo = new AppInfo();