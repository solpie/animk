/// <reference path="BaseView.ts"/>
/// <reference path="SettingView.ts"/>
/// <reference path="OnHoldView.ts"/>

class PopupView {
    settingView:SettingView;
    onHoldView:OnHoldView;
    constructor() {

    }

    initSettingView() {
        this.settingView = new SettingView();
        $(ElmId$.fileMenuOption).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.OpenSettingWin);
        });

        this.onHoldView = new OnHoldView();
    }
}