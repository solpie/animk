interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    html(): string;
    html(val:string): JQuery;
    data(val:string):JQuery;
    show(): JQuery;
    addClass(className:string): JQuery;
    removeClass(className:string): JQuery;
    on(type:string, func):JQuery;
    remove();
    append(el:HTMLElement): JQuery;
    val(): string;
    val(value:string): JQuery;
    attr(attrName:string): string;
}


declare var $:{
    (el:HTMLElement): JQuery;
    (selector:string): any;
    (val:string, isNew:boolean): HTMLElement;
    (readyCallback:() => void): JQuery;
};
