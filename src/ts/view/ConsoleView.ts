/// <reference path="BaseView.ts"/>

class ConsoleView extends BasePopup {
    _input$:JQuery;

    constructor() {
        super('template/ConsoleWin.html', ElmId$.popupLayer);
        cmd.on(CommandId.ShowConsoleWin, ()=> {
            this.show();
            var input$ = $(ElmClass$.ConsoleInput);
            if (input$) {
                console.log(this, "input$", input$.val());
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
        if (this._input$.val())
            this._input$.val(this._input$.val().replace("`", ""));
        this._input$.focus();
        //$(ElmClass$.ConsoleInput).val("");

        console.log(this, this._input$);
        //this._input$.on(KeyEvt.DOWN, (e)=> {
        //    this._input$.val(this._input$.val().replace("`", ""));
        //});
        this._input$.on(KeyEvt.UP, (e)=> {
            this.updateItem(this._input$.val());
        });
        this._input$.on(KeyEvt.PRESS, (e)=> {
            var input = this._input$.val();
            if (input)
                this._input$.val(input.replace("`", ""));

            //if (input == "`") {
            //    this._input$.val("");
            //}
            //else {
            //}
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

    updateItem(key:string) {
        var items;

        if (key) {
            items = [];
            cmd.cmdArr.map((ci:CommandItem)=> {
                if (ci.name.toLowerCase().search(key.toLowerCase()) > -1) {
                    items.push(ci);
                }
            })
        }
        else {
            items = cmd.cmdArr;
        }
        var itemHtml = "";
        for (var i = 0; i < items.length; i++) {
            var commandItem:CommandItem = items[i];
            itemHtml += '<div class="CmdItem" id="CmdItemId' + i + '">' + commandItem.name + '</div>'
        }
        $(ElmId$.consoleItemHint).html(itemHtml);
    }
}