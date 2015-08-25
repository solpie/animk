/// <reference path="../model/AppInfo.ts"/>
/// <reference path="ProjectView.ts"/>
/// <reference path="TimelineView.ts"/>
/// <reference path="WindowView.ts"/>
/// <reference path="SplitterView.ts"/>
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
        document.onkeydown = this.onKeyDown;
        //super();
        var titleBarView = new WindowView();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];

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
        //console.log(this, e, key, isCtrl, isShift,isAlt);
    }

    resize(w, h) {
        this.timelineView.resize(w, h - $(ViewportId$).height() - $(TitleBarId$).height() - 29 - $(ElmId$.bottomBar).height());
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
            //splitter.css({top: splitter.position().top + dy})
            this.timelineView.resize(-1, $(TimelineId$).height() - deltaVal);

        });
        this.hSplitter = new SplitterView(Direction.Horizontal, ElmId$.hSplitter);
        this.hSplitter.setChildren(ElmId$.comp, ElmId$.toolShelf);

        win.on(ViewEvent.RESIZE, (w, h) => {
            this.resize(w, h);
        });
    }
}