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
    _this$:string;

    constructor(tplPath:string, parentId$:string, this$?:string) {
        super();
        this._tplPath = tplPath;
        this._parentId$ = parentId$;
        this._this$ = this$;
    }

    _load() {
        $.get(this._tplPath, (template)=> {
            this._html = Mustache.render(template);
            this.show();
            this._init();
        });
    }

    _init() {
        if (!this._isInit) {
            this._isInit = true;
            $(this._parentId$).append(this._html);
            this._onLoad();
            this.emit(ViewEvent.LOADED);
        }
    }

    _onLoad() {
        //override in subClass
    }

    _onShow() {
        //override in subClass
    }

    hide() {
        var parent$ = $(this._parentId$);
        this.hideThis$();
        parent$.hide();
        this.emit(ViewEvent.HIDED);
    }

    hideThis$() {
        if (this._this$)
            $(this._this$).hide();
    }

    show() {
        if (!this._isInit) {
            this._load();
        }
        else {
            var parent$ = $(this._parentId$);
            parent$.show();
            if (this._this$) {
                $(this._this$).show();
                this._onShow();
            }
        }
    }
}