/// <reference path="../model/AppInfo.ts"/>
/// <reference path="../view/ProjectView.ts"/>
/// <reference path="../view/TimelineView.ts"/>

class AnimkView {
    appModel:AppInfo;
    projectViewArr:Array<ProjectView>;
    timelineView:TimelineView;

    constructor(appModel) {
        this.appModel = appModel;
        var ins = this;
        this.appModel.add('newProject', function () {
            ins.onNewProject();
        });
        //super();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];
    }

    onNewProject() {
        console.log(this, 'new project');
        var view = new ProjectView(this.appModel.projectInfo);
        this.projectViewArr.push(view);
    }
}