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
            var trackName = $(ElmId$.newPngWinTrackName).val();
            if (count > 999) {
                console.log(this, "too many");
            }
            else
                appInfo.curComp().newEmptyTrack(trackName, "D:/projects/animk/test/empty", count);
            this.hide();
        });

        $(ElmId$.newPngWinBtnCancel).on(MouseEvt.CLICK, ()=> {
            this.hide();
        });
    }

    _onShow() {
        $(ElmId$.newPngWinTrackName).val(appInfo.curComp().newTrackName());
        $(ElmId$.newPngWinCount).val(10);
        this.center(appInfo.width(), appInfo.height())
    }
}