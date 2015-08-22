/// <reference path="../model/AppInfo.ts"/>
/// <reference path="ProjectView.ts"/>
/// <reference path="TimelineView.ts"/>
/// <reference path="WindowView.ts"/>
/// <reference path="SplitterView.ts"/>

class AnimkView {
    appModel:AppInfo;
    projectViewArr:Array<ProjectView>;
    timelineView:TimelineView;
    vSplitter:SplitterView;
    hSplitter:SplitterView;

    constructor(appModel) {
        this.appModel = appModel;
        var ins = this;
        this.appModel.add('newProject', function () {
            ins.onNewProject();
        });

        document.onmousemove = (e)=> {
            this.appModel.mouseX = e.clientX;
            this.appModel.mouseY = e.clientY;
        };
        document.onmouseup = ()=> {
            this.appModel.dis(MouseEvt.UP);
        };
        //super();
        var titleBarView = new WindowView();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];
    }

    onNewProject() {
        console.log(this, 'new project');
        var view = new ProjectView(this.appModel.projectInfo);
        this.projectViewArr.push(view);
    }

    onDomReady() {
        this.vSplitter = new SplitterView(Direction.Vertical, "#VSplitter0");
        this.vSplitter.setChildren("#Viewport0", "#timeline");
        this.vSplitter.add(ViewEvent.CHANGED, (deltaVal:number)=> {
            console.log(this, "V changed", deltaVal);
            //splitter.css({top: splitter.position().top + dy})
            var vScrollBar = $("#compositionHeight");
            vScrollBar.css({top: vScrollBar.position().top + deltaVal});
        });
        this.hSplitter = new SplitterView(Direction.Horizontal, "#HSplitter0");
        this.hSplitter.setChildren("#Comp0", "#ToolShelf0");
    }
}