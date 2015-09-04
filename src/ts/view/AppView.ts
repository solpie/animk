/// <reference path="../model/AppInfo.ts"/>
/// <reference path="ConsoleView.ts"/>
/// <reference path="FileMenuView.ts"/>
/// <reference path="KeyInput.ts"/>
/// <reference path="ProjectView.ts"/>
/// <reference path="TimelineView.ts"/>
/// <reference path="WindowView.ts"/>
/// <reference path="../widget/Splitter.ts"/>
/// <reference path="CanvasView.ts"/>
/// <reference path="PopupView.ts"/>
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
        var titleBarView = new WindowView();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];
        this.canvasView = new CanvasView();
        this.popupView = new PopupView();
        new ConsoleView();
        new FileMenuView();
        this.initFileMenu();
    }

    initZIndex() {
        for (var i in ZIdx) {
            $(ZIdx[i]).css({"z-index": 1000 + i});
        }
    }

    resize(w, h) {
        this.timelineView.resize(w, h - $(ViewportId$).height() - $(TitleBarId$).height() - 29 - $(ElmId$.bottomBar).height());
    }

    onNewProject() {
        console.log(this, 'new project');
        var view = new ProjectView(this.appInfo.projectInfo);
        this.projectViewArr.push(view);
    }

    initFileMenu() {
        $.get('template/TitleMenu.html', (template)=> {
            var rendered = Mustache.render(template);
            $(ElmId$.titleMenu).html(rendered);
            this.popupView.initSettingView();
            var isShow:boolean = false;

            $(ElmId$.fileMenu).on(MouseEvt.UP, ()=> {
                $(ElmId$.fileMenu).hide();
            });

            $(ElmId$.menuBtnFile).on(MouseEvt.CLICK, ()=> {
                isShow = !isShow;
                if (isShow)
                    $(ElmId$.fileMenu).show();
                else
                    $(ElmId$.fileMenu).hide();
            });

            $(ElmId$.fileMenuNew).on(MouseEvt.CLICK, ()=> {
            });

            $(ElmId$.fileMenuOpen).on(MouseEvt.CLICK, ()=> {
                this.fileMenuOpen();
            });

            $(ElmId$.fileMenuSave).on(MouseEvt.CLICK, ()=> {
                if (appInfo.projectInfo.saveFilename)
                    this.fileMenuSave(appInfo.projectInfo.saveFilename);
                else
                    this.fileMenuSave();
            });

            $(ElmId$.fileMenuSaveAs).on(MouseEvt.CLICK, ()=> {
                this.fileMenuSave();
            });
        });

    }

    fileMenuOpen() {
        chooseFile(ElmId$.openFileDialog).change(()=> {
            var filename = $(ElmId$.openFileDialog).val();
            console.log(this, "open project file", filename);
            appInfo.openProject(filename);
        });
    }

    fileMenuSave(path?) {
        if (isdef(path)) {
            appInfo.projectInfo.save(path)
        }
        else {
            chooseFile(ElmId$.saveAsDialog).change(()=> {
                var filename = $(ElmId$.saveAsDialog).val();
                console.log(this, "save as", filename);
                appInfo.projectInfo.save(filename);
            });
        }
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