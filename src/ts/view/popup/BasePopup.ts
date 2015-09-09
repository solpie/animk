/// <reference path="../BaseView.ts"/>

class BasePopup extends BaseView {
    _isInit = false;
    _tplPath:string;
    _parentId$:string;
    _html:string;
    _this$:string;

    constructor(tplPath:string, parentId$:string, this$?:string) {
        super(this$);
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

    setMousePass(val) {
        if (val)
            $(this._parentId$).css({"pointer-events": "none"});
        else
            $(this._parentId$).css({"pointer-events": "auto"});
    }

    show() {
        this.setMousePass(false);
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