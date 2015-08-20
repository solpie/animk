/// <reference path="view/BaseView.ts"/>
/// <reference path="event/EventDispatcher.ts"/>
/// <reference path="JQuery.ts"/>
/// <reference path="model/ProjectInfo.ts"/>
/// <reference path="view/CompositionView.ts"/>
/// <reference path="view/ProjectView.ts"/>
/// <reference path="view/TimelineView.ts"/>
class AppModel extends EventDispatcher {
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
class AnimkView {
    appModel:AppModel;
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
        //jq
        $("#app").data("appModel", appModel);
    }

    onNewProject() {
        console.log(this, 'new project');
        var view = new ProjectView(this.appModel.projectInfo);
        this.projectViewArr.push(view);
    }
}
var appModel:AppModel;
var app:AnimkView;
// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    appModel = new AppModel();
    app = new AnimkView(appModel);
    appModel.test();
});

