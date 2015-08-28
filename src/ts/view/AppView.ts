/// <reference path="../model/AppInfo.ts"/>
/// <reference path="ProjectView.ts"/>
/// <reference path="TimelineView.ts"/>
/// <reference path="WindowView.ts"/>
/// <reference path="../widget/Splitter.ts"/>
/// <reference path="CanvasView.ts"/>
var Keys = {
    Space: function (k) {
        return k == 32;
    },
    ESC: function (k) {
        return k == 27;
    },
    Char: function (key, c) {
        return key == c.charCodeAt(0);
    },
};
class AnimkView {
    appInfo:AppInfo;
    projectViewArr:Array<ProjectView>;
    canvasView:CanvasView;
    timelineView:TimelineView;
    vSplitter:SplitterView;
    hSplitter:SplitterView;

    constructor(appModel) {
        this.appInfo = appModel;

        this.appInfo.add(ProjectInfoEvent.NEW_PROJ, ()=> {
            this.onNewProject();
        });
        this.appInfo.add(TheMachineEvent.UPDATE_IMG, ()=> {
            this.canvasView.updateComp();
        });

        document.onmousemove = (e)=> {
            this.appInfo.mouseX = e.clientX;
            this.appInfo.mouseY = e.clientY;
        };
        document.onmouseup = ()=> {
            this.appInfo.dis(MouseEvt.UP);
        };
        document.onkeydown = this.onKeyDown;
        //super();
        var titleBarView = new WindowView();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];
        this.canvasView = new CanvasView();
        this.initZIndex();
    }

    initZIndex() {
        for (var i in ZIdx) {
            $(ZIdx[i]).css({"z-index": 1000 + i});
        }
    }

    onKeyDown(e) {
        var key = e.keyCode;
        var isCtrl = e.ctrlKey;
        var isShift = e.shiftKey;
        var isAlt = e.altKey;
        if (Keys.Char(key, "F")) {
            appInfo.projectInfo.curComp.forward()
        }
        else if (Keys.Char(key, "D")) {
            appInfo.projectInfo.curComp.backward()
        }
        else if (Keys.Space(key)) {//Space
            appInfo.projectInfo.curComp.toggle();
        }
        else if (Keys.ESC(key)) {//Space
            appInfo.projectInfo.curComp.stayBack();
        }
        else if (Keys.Char(key, "\r")) {//enter
            appInfo.tm.watchAct();
        }
        /// project open save
        else if (Keys.Char(key, "S") && isCtrl) {//enter
            appInfo.projectInfo.save("../test/data.json");
        }
        //console.log(this, e, key, isCtrl, isShift,isAlt);
    }

    resize(w, h) {
        this.timelineView.resize(w, h - $(ViewportId$).height() - $(TitleBarId$).height() - 29 - $(ElmId$.bottomBar).height());
    }

    onNewProject() {
        console.log(this, 'new project');
        var view = new ProjectView(this.appInfo.projectInfo);
        this.projectViewArr.push(view);
    }

    onDomReady() {
        this.vSplitter = new SplitterView(Direction.Vertical, VSplitterId$);
        this.vSplitter.setChildren(ViewportId$, TimelineId$);
        this.vSplitter.add(ViewEvent.CHANGED, (deltaVal:number)=> {
            //splitter.css({top: splitter.position().top + dy})
            this.timelineView.resize(-1, $(TimelineId$).height() - deltaVal);

        });
        this.hSplitter = new SplitterView(Direction.Horizontal, ElmId$.hSplitter);
        this.hSplitter.setChildren(ElmId$.comp, ElmId$.toolShelf);

        win.on(ViewEvent.RESIZE, (w, h) => {
            this.resize(w, h);
        });

        this.canvasView.init();
    }
}