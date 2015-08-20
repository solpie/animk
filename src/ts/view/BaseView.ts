/// <reference path="../JQuery.ts"/>
var jade = require("jade");
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