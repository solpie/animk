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
    unbind(value:string): JQuery;
    change(func:any): JQuery;
    trigger(type:any): JQuery;
    attr(attrName:string): string;
}


declare var $:{
    (el:HTMLElement): JQuery;
    (selector:string): any;
    (val:string, isNew:boolean): HTMLElement;
    (readyCallback:() => void): JQuery;
};

function chooseFile(name):JQuery {
    var chooser = $(name);
    chooser.unbind('change');
    //chooser.change(function (evt) {
    //
    //});
    chooser.trigger('click');
    return chooser;
}
