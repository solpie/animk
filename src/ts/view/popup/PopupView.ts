/// <reference path="BasePopup.ts"/>
/// <reference path="SettingView.ts"/>
/// <reference path="ConsoleView.ts"/>
/// <reference path="OnHoldView.ts"/>
/// <reference path="TrackMenu.ts"/>
/// <reference path="DialogOK.ts"/>

class PopupView {
    settingView:SettingView;
    onHoldView:OnHoldView;
    consoleView:ConsoleView;
    trackMenu:TrackMenu;
    dialogOK:DialogOK;
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

    newView(cls) {
        var obj = new cls;
        this._popupArr.push(obj);
        obj.on(ViewEvent.HIDED, ()=> {
            this.hideAll()
        });
        return obj;
    }

    initSettingView() {
        this.settingView = this.newView(SettingView);
        $(ElmId$.fileMenuOption).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.ShowSettingWin);
        });

        this.onHoldView = this.newView(OnHoldView);//       OnHoldView();
        this.consoleView = this.newView(ConsoleView);//     ConsoleView();
        this.trackMenu = this.newView(TrackMenu);//         TrackMenu();
        this.dialogOK = this.newView(DialogOK);//           DialogOK();
    }
}