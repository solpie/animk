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

    top(val) {
        $(this.id$).css({top: val});
    }

    setColor(val:string) {
        $(this.id$).css({background: val});
    }
}

class BasePopup extends EventDispatcher {
    _isInit = false;
    _tplPath:string;
    _parentId$:string;
    _html:string;
    _this$:JQuery;

    constructor(tplPath:string, parentId$:string) {
        super();
        this._tplPath = tplPath;
        this._parentId$ = parentId$;
    }

    _load() {
        $.get(this._tplPath, (template)=> {
            this._html = Mustache.render(template);
            this.show();
            this._init();
        });
    }

    _init() {
        this._isInit = true;
        this.emit(ViewEvent.LOADED);
    }

    _onLoad() {
        //override in subClass
    }

    hide() {
        var parent$ = $(this._parentId$);
        parent$.html("");
        parent$.hide();
    }

    show() {
        if (!this._isInit) {
            this._load();
        }
        else {
            var parent$ = $(this._parentId$);
            parent$.html(this._html);
            parent$.show();
            this._onLoad();
        }
    }
}