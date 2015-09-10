/// <reference path="BasePopup.ts"/>

class NewPngWin extends BasePopup {
    constructor() {
        super('template/NewPngWin.html', ElmId$.popupLayer, ElmId$.newPngWin);
        cmd.on(CommandId.ShowNewPngWin, ()=> {
            this.show();
        });
        cmd.on(CommandId.HideNewPngWin, ()=> {
            this.hide();
        });
    }


    _onLoad() {

    }

    _onShow() {
        this.center(appInfo.width(), appInfo.height())
    }
}