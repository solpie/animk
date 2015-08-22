/// <reference path="EventDispatcher.ts"/>
class BaseEvent {
    type:string;
    target:EventDispatcher;
}
class ActEvent extends BaseEvent {
    static NEW_TRACK:string = "new track";
    static SEL_TRACK:string = "select track";
    static DEL_TRACK:string = "delete track";
}

class ViewEvent {
    static CHANGED:string = "changed";
    static RESIZE:string = "resize";

}

class MouseEvt {
    static CLICK:string = "click";
    static UP:string = "mouseup";
    static DOWN:string = "mousedown";
    static LEAVE:string = "mouseleave";
}