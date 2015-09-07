/// <reference path="BaseView.ts"/>

class ConsoleView extends BasePopup {
    _input$:JQuery;
    _cmdItemArr:Array<CommandItem>;

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
            this.close();
        });
    }

    _init() {
        super._init();
    }

    close() {
        KeyInput.isBlock = false;
        this.hide();
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
                if (this._cmdItemArr.length == 1) {
                    cmd.emit(this._cmdItemArr[0].id);
                }

                this.close();
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

        if (key) {
            this._cmdItemArr = [];
            cmd.cmdArr.map((ci:CommandItem)=> {
                var ciname = ci.name.toLowerCase();
                var a = key.split(' ');
                if (a.length > 1) {
                    var match = true;
                    var cnameArr = ciname.split(" ");
                    if (cnameArr.length < a.length)
                        return;
                    for (var i = 0; i < a.length; i++) {
                        var sidx = cnameArr[i].search(a[i].toLowerCase());
                        if (sidx != 0) {
                            match = false;
                            break;
                        }
                        //else if (sidx != ciname.length && ciname.substr(sidx - 1, 1) != "") {
                        //    console.log(this, "mismatch", ciname.substr(sidx - 1, 1), a[i])
                        //    match = false;
                        //    break
                        //}
                    }
                    if (match)
                        this._cmdItemArr.push(ci);
                }
                else if (ciname.search(key.toLowerCase()) > -1) {
                    this._cmdItemArr.push(ci);
                }
            })
        }
        else {
            this._cmdItemArr = cmd.cmdArr;
        }
        var itemHtml = "";
        for (var i = 0; i < this._cmdItemArr.length; i++) {
            var commandItem:CommandItem = this._cmdItemArr[i];
            itemHtml += '<div class="CmdItem" id="CmdItemId' + i + '">' + commandItem.name + '</div>'
        }
        $(ElmId$.consoleItemHint).html(itemHtml);
    }
}