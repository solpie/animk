/// <reference path="BaseView.ts"/>

interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    html(): string;
    html(val:string): JQuery;
    data(val:string):JQuery;
    show(): JQuery;
    addClass(className:string): JQuery;
    removeClass(className:string): JQuery;
    on(type:string, func):JQuery;
    remove();
    append(el:HTMLElement): JQuery;
    val(): string;
    val(value:string): JQuery;
    attr(attrName:string): string;
}


declare var $:{
    (el:HTMLElement): JQuery;
    (selector:string): any;
    (val:string, isNew:boolean): HTMLElement;
    (readyCallback:() => void): JQuery;
};

class EventDispatcher {
    _func:Object;

    constructor() {
        this._func = {};
    }

    add(type:string, func) {
        if (!this._func[type])
            this._func[type] = [];
        this._func[type].push(func);
    }

    dis(type:string) {
        if (this._func[type])
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                f();
            }
    }
}


class ProjectInfo extends EventDispatcher {
    comps:Array<CompositionInfo>;
    curComp:CompositionInfo;
    constructor(options?) {
        super();
        console.log("new project");
    }

    newComp():CompositionInfo {
        this.curComp = new CompositionInfo();
        return this.curComp;
    }

}

class TrackInfo {
    idx:number;
    name:string;
    isRomve:boolean;

}
interface IBaseView {
    render():void;
}
class TrackView implements IBaseView {
    trackInfo:TrackInfo;
    el:HTMLElement;

    constructor(idx:number) {
        this.trackInfo = new TrackInfo();
        this.trackInfo.idx = idx;
    }

    render() {
        if (!this.el) {
            this.el = $('<div class="track">track_' + this.trackInfo.idx + '</div>').data('idx', this.trackInfo.idx);
        }
        var instance = this;
        $(this.el).on("click", function () {
            appModel.projectInfo.curComp.delTrack(instance.trackInfo.idx);
        });
        return this.el;
    }

    remove() {
        console.log(this, "remove1");
        $(this.el).remove();
    }

}
class CompositionInfo extends EventDispatcher {
    trackArr:Array<TrackInfo>;
    trackViewArr:Array<TrackView>;

    constructor() {
        super();
        this.trackArr = [];
        this.trackViewArr = [];
        console.log("new CompInfo");
    }

    newTrack() {
        //this.trackArr.push(trackInfo);
        var view = new TrackView(this.trackViewArr.length);
        this.trackViewArr.push(view);
        $("#composition").append(view.render());
    }

    delTrack(idx:number) {
        //this.trackArr.splice(idx, 1);
        //delete this.trackArr[idx];
        this.dis("delTrack");
        console.log("delete trackInfo", this, this.getTrackInfoArr().length);
        this.trackViewArr[idx].remove();
        delete this.trackViewArr[idx];
        //this.trackViewArr.splice(idx, 1);
    }

    getTrackInfoArr():Array<TrackInfo> {
        var a = [];
        for (var i = 0; i < this.trackViewArr.length; ++i) {
            if (this.trackViewArr[i])
                a.push(this.trackViewArr[i].trackInfo);
        }
        return a;
    }
}
class CompositionView implements IBaseView {
    trackViewArr:Array<TrackView>;
    compInfo:CompositionInfo;

    constructor(compInfo:CompositionInfo) {
        this.compInfo = compInfo;
        compInfo.add("delTrack", this.delTrack);
        this.trackViewArr = [];
    }

    render():void {

    }

    newTrack() {
        //this.trackArr.push(trackInfo);
        var view = new TrackView(this.trackViewArr.length);
        this.trackViewArr.push(view);
        $("#composition").append(view.render());
    }

    delTrack() {
        console.log("test view");
    }

}
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

