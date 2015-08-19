interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    html(): string;
    html(val:string): JQuery;
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

class ProjectInfo {
    comps:Array<CompositionInfo>;
    curComp:CompositionInfo;

    constructor(options?) {
        console.log("new project");
        this.curComp = new CompositionInfo();
    }

}

class TrackInfo {
    idx:Number;
    name:string;
}
interface BaseView {
    render():void;
}
class TrackView implements BaseView {
    trackInfo:TrackInfo;

    constructor(trackInfo) {
        this.trackInfo = trackInfo;
    }

    render() {
        return $('<div class="track">track_' + this.trackInfo.idx + '</div>');
    }

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
        var view = new TrackView(trackInfo);
        $("#composition").append(view.render());
    }
}

class AnimkView {
    projectInfo:ProjectInfo;

    constructor() {
        //super();
        //this.setElement($("#root"), true);

        //jq
        var instance = this;
        $("#newTrack").on("click", function () {
            console.log("this", this);
            instance.onNewTrack();
        });


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

    render() {
    }
}


// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    new AnimkView();
});

