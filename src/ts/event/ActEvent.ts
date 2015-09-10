/// <reference path="EventDispatcher.ts"/>
class BaseEvent {
    type:string;
    target:EventDispatcher;
}
enum  MouseButton{
    LEFT = 0,
    MID ,
    RIGHT,
}
class MouseEvt {
    static CLICK:string = "click";//build-in name
    static DBLCLICK:string = "dblclick";//build-in name
    static UP:string = "mouseup";//build-in name
    static DOWN:string = "mousedown";//build-in name
    static LEAVE:string = "mouseleave";//build-in name
    static RCLICK:string = "contextmenu";//build-in name
}
class KeyEvt {
    static DOWN:string = "keydown";//build-in name
    static UP:string = "keyup";//build-in name
    static PRESS:string = "keypress";//build-in name

}
class ViewEvent {
    static CHANGED:string = "change";//build-in name
    static RESIZE:string = "resize";
    static SCROLL:string = "scroll";
    static LOADED:string = "loaded";
    static HIDED:string = "hided";
}
///   model  events
class ProjectInfoEvent {
    static NEW_PROJ:string = "NEW_PROJ";
}
class SettingInfoEvent {
    static SET_TMP_PATH:string = "SET_TMP_PATH";
    static SET_DRAW_APP1:string = "SET_DRAW_APP1";
    static SET_DRAW_APP2:string = "SET_DRAW_APP2";
}
class CompInfoEvent {
    static NEW_COMP:string = "new comp";
    static NEW_TRACK:string = "new track";
    static DEL_TRACK:string = "delete track";
    static SWAP_TRACK:string = "swap track";
    static UPDATE_CURSOR:string = "UPDATE_Cursor";
}
class TrackInfoEvent {
    static LOADED:string = "load all imgs";
    static SEL_TRACK:string = "select track";
    static SEL_FRAME:string = "select frame";
    static DEL_FRAME:string = "delete frame";
    static SET_ACT_TYPE:string = "set act type";
    static SET_OPACITY:string = "set track opacity";
    static SET_ENABLE:string = "set track enable";
    static SET_NAME:string = "set track name";
    static SET_TRACK_START:string = "SET_TRACK_START";
}
class FrameTimerEvent {
    static TICK:string = "TICK";
}
class TheMachineEvent {
    static UPDATE_IMG:string = "UPDATE_IMG";
    static ADD_IMG:string = "ADD_IMG";

}