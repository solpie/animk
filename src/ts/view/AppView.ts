/// <reference path="../model/AppInfo.ts"/>
/// <reference path="popup/PopupView.ts"/>
/// <reference path="TitleMenuView.ts"/>
/// <reference path="FileMenuView.ts"/>
/// <reference path="KeyInput.ts"/>
/// <reference path="ProjectView.ts"/>
/// <reference path="TimelineView.ts"/>
/// <reference path="WindowView.ts"/>
/// <reference path="../widget/Splitter.ts"/>
/// <reference path="CanvasView.ts"/>
/// <reference path="../JQuery.ts"/>

var Keys = {
    GraveAccent: (k)=> {
        return k == 192
    },
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
    popupView:PopupView;

    constructor(appModel) {
        this.appInfo = appModel;

        this.appInfo.on(ProjectInfoEvent.NEW_PROJ, ()=> {
            this.onNewProject();
        });
        this.appInfo.on(TheMachineEvent.UPDATE_IMG, ()=> {
            this.canvasView.updateComp();
        });

        document.onmousemove = (e)=> {
            this.appInfo.mouseX = e.clientX;
            this.appInfo.mouseY = e.clientY;
        };
        document.onmouseup = ()=> {
            this.appInfo.emit(MouseEvt.UP);
        };

        document.onkeydown = KeyInput.onKeyDown;

        //super();
        new WindowView();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];
        this.canvasView = new CanvasView();
        this.popupView = new PopupView();
        var tmv = new TitleMenuView();
        tmv.on(ViewEvent.LOADED, ()=> {
            new FileMenuView();
            this.popupView.initSettingView();
            tmv.onLoad();
        });
    }

    initZIndex() {
        for (var i in ZIdx) {
            $(ZIdx[i]).css({"z-index": 1000 + i});
        }
    }

    resize(w, h) {
        this.appInfo.width(w);
        this.appInfo.height(h);
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
        this.vSplitter.on(ViewEvent.CHANGED, (deltaVal:number)=> {
            //splitter.css({top: splitter.position().top + dy})
            this.timelineView.resize(-1, $(TimelineId$).height() - deltaVal);

        });
        this.hSplitter = new SplitterView(Direction.Horizontal, ElmId$.hSplitter);
        this.hSplitter.setChildren(ElmId$.comp, ElmId$.toolShelf);

        win.on(ViewEvent.RESIZE, (w, h) => {
            this.resize(w, h);
        });

        this.canvasView.init();
        this.initZIndex();
        appInfo.newProject();
    }
}