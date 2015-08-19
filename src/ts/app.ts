declare module Backbone {
    export class Model {
        constructor(attr?, opts?);

        get(name:string):any;

        set(name:string, val:any):void;
        set(obj:any):void;

        save(attr?, opts?):void;

        destroy():void;

        bind(ev:string, f:Function, ctx?:any):void;

        toJSON():any;
    }
    export class Collection<T> {
        constructor(models?, opts?);

        bind(ev:string, f:Function, ctx?:any):void;

        length:number;

        create(attrs, opts?):any;

        each(f:(elem:T) => void):void;

        fetch(opts?:any):void;

        last():T;
        last(n:number):T[];

        filter(f:(elem:T) => boolean):T[];

        without(...values:T[]):T[];
    }
    export class View {
        constructor(options?);

        $(selector:string):JQuery;

        el:HTMLElement;
        $el:JQuery;
        model:Model;

        remove():void;

        delegateEvents:any;

        make(tagName:string, attrs?, opts?):View;

        setElement(element:HTMLElement, delegate?:boolean):void;
        setElement(element:JQuery, delegate?:boolean):void;

        tagName:string;
        events:any;

        static extend:any;
    }
}
interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    html(): string;
    html(val:string): JQuery;
    show(): JQuery;
    addClass(className:string): JQuery;
    removeClass(className:string): JQuery;
    remove();
    append(el:HTMLElement): JQuery;
    val(): string;
    val(value:string): JQuery;
    attr(attrName:string): string;
}
declare var $:{
    (el:HTMLElement): JQuery;
    (selector:string): JQuery;
    (readyCallback:() => void): JQuery;
};
declare var _:{
    each<T, U>(arr:T[], f:(elem:T) => U): U[];
    delay(f:Function, wait:number, ...arguments:any[]): number;
    template(template:string): (model:any) => string;
    bindAll(object:any, ...methodNames:string[]): void;
};
declare var Store:any;

class ProjectInfo extends Backbone.Model {
    comps:Array<CompositionInfo>
    curComp:CompositionInfo;

    constructor(options?) {
        super(options);
        console.log("new project");
        this.curComp = new CompositionInfo();
    }

}

class TrackInfo{
    idx:Number;
    name:string;
}
class TrackView extends Backbone.View {
    render() {
        this.$el.html('<div class="track"></div>');
        return this;
    }
}
class TrackInfoList extends Backbone.Collection<TrackInfo> {
    model = TrackInfo;
    localStorage = new Store("animk-track");

}
class CompositionInfo {
    tracks:Array<TrackInfo>;

    constructor() {
        this.tracks = new Array<TrackInfo>();
        console.log("new CompInfo", this.tracks);
    }

    newTrack() {
        var trackInfo:TrackInfo = new TrackInfo();
        trackInfo.idx = this.tracks.length;
        this.tracks.push(trackInfo);
        var comp = $("#composition2");
        if (comp) {
            var view = new TrackView();
            comp.append(view.render().el);
        }
    }
}

class AnimkView extends Backbone.View {
    // Delegated events for creating new items, and clearing completed ones.
    events = {
        //    "keypress #new-todo": "createOnEnter",
        //    "keyup #new-todo": "showTooltip",
        "click #newTrack": "onNewTrack",
        "click .track": "onClkTrack",
        //    "click .mark-all-done": "toggleAllComplete"
    };
    input:JQuery;
    projectInfo:ProjectInfo;

    constructor() {
        super();
        this.setElement($("#root"), true);
        _.bindAll(this, 'render');
        this.projectInfo = new ProjectInfo();
    }

    onClkTrack(event) {
        //$("#track")
        //$("#track1").remove();
        event.target.remove();
        console.log("del track", event.target.id);
    }

    onNewTrack() {
        console.log("on click");
        this.projectInfo.curComp.newTrack();
    }

    addTrack(trackInfo) {
        var comp = $("#composition2");
        console.log("add Track", trackInfo, this);
        if (comp) {
            var view = new TrackView();
            comp.append(view.render().el);
        }
    }

    render() {
    }
}


// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    new AnimkView();
});

