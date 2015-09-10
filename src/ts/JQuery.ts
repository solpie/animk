interface JQuery {
    fadeIn(): JQuery;
    fadeOut(): JQuery;
    focus(): JQuery;
    html(): string;
    html(val:string): JQuery;
    data(val:string):JQuery;
    css(val):JQuery;
    show(): JQuery;
    hide(): JQuery;
    addClass(className:string): JQuery;
    removeClass(className:string): JQuery;
    on(type:string, func):JQuery;
    remove();
    append(el:HTMLElement): JQuery;
    offset(): any;
    val(): string;
    val(value:string): JQuery;
    width(): string;
    width(value:number): JQuery;
    height(): string;
    height(value:number): JQuery;
    scrollTop(value:number): JQuery;
    scrollLeft(value:number): JQuery;
    unbind(value:string): JQuery;
    change(func:any): JQuery;
    trigger(type:any): JQuery;
    attr(attrName:string): string;
    position():any;
    (selector:string): any;
}


declare var $:{
    get(val:string, func:any);
    (el:HTMLElement): JQuery;
    (selector:string): any;
    (readyCallback:() => void): JQuery;
};

interface HTMLElement {
    getContext(val:string):any;
    toDataURL(val:string):any;
}
declare var Mustache:{
    render(tpl:string, data?:Object);
};

function chooseFile(name):JQuery {
    var chooser = $(name);
    chooser.unbind('change');
    //chooser.change(function (evt) {
    //});
    chooser.trigger('click');
    return chooser;
}
