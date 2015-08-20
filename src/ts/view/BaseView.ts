/// <reference path="../JQuery.ts"/>
interface IBaseView {
    render():void;
}
class BaseView {
    el:HTMLElement;
    self:BaseView;
    constructor() {
        this.self = this;
    }

    setElement(val:string):void {
        this.el = $(val);
    }
}