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
        $(ElmId$.newPngWinBtnOK).on(MouseEvt.CLICK, ()=> {
            var count = $(ElmId$.newPngWinCount).val();
            appInfo.curComp().newEmptyTrack("../test/empty", count);
            this.hide();
        });

        $(ElmId$.newPngWinBtnCancel).on(MouseEvt.CLICK, ()=> {
            this.hide();
        });
    }

    _onShow() {
        this.center(appInfo.width(), appInfo.height())
    }
}