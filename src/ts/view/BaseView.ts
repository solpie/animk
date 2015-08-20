/// <reference path="../JQuery.ts"/>
/// <reference path="../NodeJS.ts"/>
var jade = require("jade");
interface IBaseView {
    render():HTMLElement;
}
class BaseView implements IBaseView{
    el:HTMLElement;

    constructor() {
    }

    setElement(val:string):void {
        this.el = $(val);
    }
    render(){
        return undefined
    }

    setParent(parent:JQuery){
        parent.append(this.render())
    }

    //render():HTMLElement {
    //
    //}
}