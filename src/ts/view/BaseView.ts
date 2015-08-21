/// <reference path="../JQuery.ts"/>
/// <reference path="../Node.ts"/>
interface IBaseView {
    render():HTMLElement;
}
class BaseView implements IBaseView {
    el:HTMLElement;
    id$:string;
    className:string;

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

    height() {
        return $(this.id$).height();
    }

    width() {
        return $(this.id$).width();
    }
}
function setupDrag(el:JQuery) {

}