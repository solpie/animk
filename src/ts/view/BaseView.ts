/// <reference path="../Model/appInfo.ts"/>
/// <reference path="../Model/Command.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../Node.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="Theme.ts"/>
/// <reference path="ViewId.ts"/>

interface IBaseView {
    render():HTMLElement;
}

class BaseView extends EventDispatcher implements IBaseView {
    el:HTMLElement;
    id$:string;

    constructor(id$?) {
        super();
        this.id$ = id$;
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

    top(val?) {
        if (isdef(val))
            $(this.id$).css({top: val});
        else
            return $(this.id$).position().top;
    }

    left(val?) {
        if (isdef(val))
            $(this.id$).css({left: val});
        else
            return $(this.id$).position().left;
    }

    setColor(val:string) {
        $(this.id$).css({background: val});
    }

    remove() {
        $(this.id$).remove();
    }
}

