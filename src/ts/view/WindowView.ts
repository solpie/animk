/// <reference path="../Node.ts"/>
/// <reference path="../JQuery.ts"/>
var gui = require('nw.gui');
var win = gui.Window.get();
class WindowView {
    constructor() {
        $("#btnClose").on("click", function () {
            console.log(win);
            win.close();
        });
        $("#btnMin").on("click", function () {
            console.log(win);
            win.minimize();
        });
        $("#btnMax").on("click", function () {
            console.log(win);
            win.maximize();
        });
    }
}