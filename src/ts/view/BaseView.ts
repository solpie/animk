/// <reference path="../JQuery.ts"/>
interface IBaseView {
    render():HTMLElement;
}
class BaseView {
    el:HTMLElement;

    constructor() {
    }

    setElement(val:string):void {
        this.el = $(val);
    }

    //render():HTMLElement {
    //
    //}
}