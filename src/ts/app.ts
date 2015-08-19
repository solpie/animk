/// <reference path="view/BaseView.ts"/>
/// <reference path="event/EventDispatcher.ts"/>
/// <reference path="JQuery.ts"/>
/// <reference path="model/ProjectInfo.ts"/>
/// <reference path="view/CompositionView.ts"/>
class AppModel extends EventDispatcher {
    projectInfo:ProjectInfo;

    constructor() {
        super();
        this.projectInfo = new ProjectInfo;
    }

    test() {
        this.projectInfo.dis("newComp");
        console.log("test newComp");
    }
}
class AnimkView {
    projectInfo:ProjectInfo;
    compViews:Array<CompositionView>;

    constructor(project:ProjectInfo) {
        //super();
        this.projectInfo = project;
        var ins = this;
        this.projectInfo.add("newComp", function () {
                ins.onNewComp();
            }
        );

        this.compViews = [];
        //jq
        var instance = this;
        $("#root").data("app", this);
        $("#newTrack").on("click", function () {
            instance.onNewTrack();
        });
    }

    onNewComp() {
        console.log("test CompositionView", this);

        var view = new CompositionView(this.projectInfo.newComp());
        this.compViews.push(view);
    }

    onDelTrack() {
        console.log("test event");
    }

    onNewTrack() {
        console.log("on click");
        this.projectInfo.curComp.newTrack();
    }
}
var appModel:AppModel;
var app:AnimkView;
// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    appModel = new AppModel();
    app = new AnimkView(appModel.projectInfo);

    appModel.test();
});

