/// <reference path="BaseView.ts"/>

class ConsoleView extends BasePopup {
    _input$:JQuery;

    constructor() {
        super('template/ConsoleWin.html', ElmId$.popupLayer);
        cmd.on(CommandId.ShowConsoleWin, ()=> {
            this.show();
            var input$ = $(ElmClass$.ConsoleInput);
            if (input$) {
                this._onLoad();
            }
        });
        cmd.on(CommandId.HideConsoleWin, ()=> {
            this.hide();
        });
    }

    _init() {
        super._init();
    }

    _onLoad() {
        this._input$ = $(ElmClass$.ConsoleInput);
        this._input$.focus();
        $(ElmClass$.ConsoleInput).val("");
        console.log(this, this._input$);
        this._input$.on(KeyEvt.UP, (e)=> {
            var input = this._input$.val();
            if (input == "`") {
                this._input$.val("");
            }
            else {
            }
            var key = e.keyCode;
            if (Keys.Char(key, "\r")) {//enter
                this._input$.val("");
            }
        });
        //this._input$.on(ViewEvent.CHANGED, ()=> {
        //    var input = $(ElmClass$.ConsoleInput).val();
        //    if (input == "`") {
        //        $(ElmClass$.ConsoleInput).val("");
        //    }
        //    console.log(this, input);
        //});
    }
}