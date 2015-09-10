/// <reference path="BasePopup.ts"/>
/// <reference path="SettingView.ts"/>
/// <reference path="ConsoleView.ts"/>
/// <reference path="OnHoldView.ts"/>
/// <reference path="TrackMenu.ts"/>
/// <reference path="DialogOK.ts"/>
/// <reference path="NewPngWin.ts"/>

class PopupView {
    settingView:SettingView;
    onHoldView:OnHoldView;
    consoleView:ConsoleView;
    trackMenu:TrackMenu;
    dialogOK:DialogOK;
    newPngWin:NewPngWin;
    _popupArr;

    constructor() {
        this._popupArr = [];
    }

    hideAll() {
        this._popupArr.map((view:BasePopup)=> {
            view.hideThis$();
        });
        KeyInput.isBlock = false;
    }

    newPopupView(cls) {
        var obj = new cls;
        this._popupArr.push(obj);
        obj.on(ViewEvent.HIDED, ()=> {
            this.hideAll()
        });
        return obj;
    }

    initSettingView() {
        this.settingView = this.newPopupView(SettingView);
        $(ElmId$.fileMenuOption).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.ShowSettingWin);
        });

        this.onHoldView = this.newPopupView(OnHoldView);//       OnHoldView();
        this.consoleView = this.newPopupView(ConsoleView);//     ConsoleView();
        this.trackMenu = this.newPopupView(TrackMenu);//         TrackMenu();
        this.dialogOK = this.newPopupView(DialogOK);//           DialogOK();
        this.newPngWin = this.newPopupView(NewPngWin)
    }
}