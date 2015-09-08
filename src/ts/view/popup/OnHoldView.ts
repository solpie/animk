/// <reference path="BasePopup.ts"/>


class OnHoldView extends BasePopup {
    constructor() {
        super('template/OnHoldWin.html', ElmId$.popupLayer, ElmId$.onHoldWin);
        cmd.on(CommandId.OpenOnHoldWin, ()=> {
            console.log(this, "OpenOnHoldWin");
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