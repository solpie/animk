/// <reference path="../Node.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
var gui = require('nw.gui');
var win = gui.Window.get();
class WindowView {
    isMaximize:boolean = false;

    constructor() {
        $("#btnClose").on(MouseEvt.CLICK, function () {
            win.close();
        });
        $("#btnDbg").on(MouseEvt.CLICK, function () {
            win.showDevTools('', true);
        });
        $("#btnMin").on(MouseEvt.CLICK, function () {
            win.minimize();
        });
        $("#btnMax").on(MouseEvt.CLICK, function () {
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

