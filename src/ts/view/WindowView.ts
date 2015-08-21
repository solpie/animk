/// <reference path="../Node.ts"/>
/// <reference path="../JQuery.ts"/>
var gui = require('nw.gui');
var win = gui.Window.get();
class WindowView {
    isMaximize:boolean = false;

    constructor() {
        $("#btnClose").on("click", function () {
            console.log(win);
            win.close();
        });
        $("#btnDbg").on("click", function () {
            win.showDevTools('', true);
        });
        $("#btnMin").on("click", function () {
            console.log(win);

            win.minimize();
        });
        $("#btnMax").on("click", function () {
            console.log(win);
            if (this.isMaximize) {
                win.unmaximize();
                this.isMaximize = false;
            }
            else {
                win.maximize();
                this.isMaximize = true;
            }
        });
    }
}