/// <reference path="../JQuery.ts"/>
/// <reference path="../Node.ts"/>
interface IBaseView {
    render():HTMLElement;
}
class BaseView implements IBaseView {
    el:HTMLElement;

    constructor() {
    }

    setElement(val:string):void {
        this.el = $(val);
    }

    render() {
        return undefined
    }

    setParent(parent:JQuery) {
        parent.append(this.render())
    }
}
function setupDrag(el:JQuery){

}