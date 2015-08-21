/// <reference path="../Node.ts"/>
/// <reference path="../JQuery.ts"/>
class TitleBarView {
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