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