/// <reference path="BaseView.ts"/>
/// <reference path="CompositionView.ts"/>
/// <reference path="../model/ProjectInfo.ts"/>

class ProjectView extends BaseView {
    projectInfo:ProjectInfo;
    compViews:Array<CompositionView>;

    constructor(projectInfo?) {
        super();
        this.compViews = [];
        if (projectInfo)
            this.projectInfo = projectInfo;
        else
            this.projectInfo = new ProjectInfo();
        //this.projectInfo.add("newComp", this.onNewComp);
        var ins = this;

        this.projectInfo.add("newComp", function () {
            ins.onNewComp();
        });
    }

    onNewComp() {
        console.log("test CompositionView", this);

        var view = new CompositionView(this.projectInfo.curComp);
        this.compViews.push(view);
    }
}