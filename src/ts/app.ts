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
class BaseModel {
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


class ProjectInfo {
    comps:Array<CompositionInfo>;
    curComp:CompositionInfo;

    constructor(options?) {
        console.log("new project");
        this.curComp = new CompositionInfo();
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
            app.projectInfo.curComp.delTrack(instance.trackInfo.idx);
        });
        return this.el;
    }

    remove() {
        console.log(this, "remove1");
        $(this.el).remove();
    }

}
class CompositionInfo extends BaseModel {
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
        app.projectInfo.curComp.dis("delTrack");
        console.log("delete trackInfo", this.getTrackInfoArr().length);
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

    constructor() {
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

}
class AnimkView {
    projectInfo:ProjectInfo;

    constructor() {
        //jq
        var instance = this;
        $("#newTrack").on("click", function () {
            instance.onNewTrack();
        });


        this.projectInfo = new ProjectInfo();
        this.projectInfo.curComp.add("delTrack", this.onDelTrack);
    }
    onDelTrack(){
        console.log("test event");
    }
    onNewTrack() {
        console.log("on click");
        this.projectInfo.curComp.newTrack();
    }
}

var app:AnimkView;
// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    app = new AnimkView();
});

