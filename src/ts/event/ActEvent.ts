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
    static SCROLL:string = "scroll";
}


class MouseEvt {
    static CLICK:string = "click";
    static UP:string = "mouseup";
    static DOWN:string = "mousedown";
    static LEAVE:string = "mouseleave";
}

class TrackInfoEvent{
    static UPDATE_HOLD:string = "UPDATE_HOLD";
    static UPDATE_START:string = "UPDATE_START";
    static UPDATE_TRACK_START:string = "UPDATE_TRACK_START";

}