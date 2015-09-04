/// <reference path="BaseView.ts"/>

class ConsoleView extends BasePopup {

    constructor() {
        super('template/ConsoleWin.html', ElmId$.popupLayer);
        cmd.on(CommandId.ShowConsoleWin, ()=> {
            this.show();
        });
        cmd.on(CommandId.HideConsoleWin, ()=> {
            this.hide();
        });
    }

    _init() {
        super._init();

    }
}