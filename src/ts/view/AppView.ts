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
        this.vSplitter = new SplitterView(Direction.Vertical, VSplitterId$);
        this.vSplitter.setChildren(ViewportId$, TimelineId$);
        this.vSplitter.add(ViewEvent.CHANGED, (deltaVal:number)=> {
            console.log(this, "V changed", deltaVal);
            //splitter.css({top: splitter.position().top + dy})
            this.timelineView.resize(-1, $(TimelineId$).height() - deltaVal);

        });
        this.hSplitter = new SplitterView(Direction.Horizontal, "#HSplitter0");
        this.hSplitter.setChildren("#Comp0", "#ToolShelf0");
        //$(ViewportId$).height(720);
        //this.timelineView.resize(-1, 223);
    }
}