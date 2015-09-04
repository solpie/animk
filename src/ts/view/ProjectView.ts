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
        else {
            throw "null project";
        }
        //this.projectInfo.add("newComp", this.onNewComp);

        this.projectInfo.on(CompInfoEvent.NEW_COMP, (compInfo)=> {
            this.onNewComp(compInfo);
        });
    }

    onNewComp(compInfo:CompositionInfo) {
        console.log(this, "onNewComp");
        var view = new CompositionView(compInfo);
        this.compViews.push(view);
    }
}