/// <reference path="BasePopup.ts"/>


class OnHoldView extends BasePopup {
    constructor() {
        super('template/OnHoldWin.html', ElmId$.popupLayer, ElmId$.onHoldWin);
        cmd.on(CommandId.ShowOnHoldWin, ()=> {
            console.log(this, "ShowOnHoldWin");
            this.show();
        });
    }

    _onLoad() {
        console.log(this, "onLoad", $(ElmId$.onHoldWin));
        $(ElmId$.onHoldWinCloseBtn).on(MouseEvt.CLICK, ()=> {
            this.hide();
        });
    }
}