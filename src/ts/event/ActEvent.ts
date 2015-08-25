/// <reference path="EventDispatcher.ts"/>
class BaseEvent {
    type:string;
    target:EventDispatcher;
}

class MouseEvt {
    static CLICK:string = "click";
    static UP:string = "mouseup";
    static DOWN:string = "mousedown";
    static LEAVE:string = "mouseleave";
}

class ViewEvent {
    static CHANGED:string = "changed";
    static RESIZE:string = "resize";
    static SCROLL:string = "scroll";
}
///   model  events
class CompInfoEvent {
    static NEW_TRACK:string = "new track";
    static DEL_TRACK:string = "delete track";
    static UPDATE_CURSOR:string = "UPDATE_Cursor";
}
class TrackInfoEvent {
    static SEL_TRACK:string = "select track";
    static SEL_FRAME:string = "select frame";
    static UPDATE_HOLD:string = "UPDATE_HOLD";
    static UPDATE_START:string = "UPDATE_START";
    static UPDATE_TRACK_START:string = "UPDATE_TRACK_START";
}
class FrameTimerEvent {
    static TICK:string = "TICK";
}
class TheMachineEvent {
    static UPDATE_IMG:string = "UPDATE_IMG";
    static ADD_IMG:string = "ADD_IMG";

}