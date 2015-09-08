/// <reference path="BaseView.ts"/>

class OnHoldView extends BasePopup {
    constructor() {
        super('template/OnHoldWin.html', ElmId$.popupLayer);
        cmd.on(CommandId.OpenOnHoldWin, ()=> {
            console.log(this, "OpenOnHoldWin");
            this.show();
        });
    }

    _onLoad() {
        console.log(this, "onLoad",$(ElmId$.onHoldWin));
        //$(ElmId$.onHoldWin).show();
        $(ElmId$.onHoldWinCloseBtn).on(MouseEvt.CLICK, ()=> {
            //$(ElmId$.onHoldWin).hide();
            $(ElmId$.popupLayer).hide();
        });
    }
}