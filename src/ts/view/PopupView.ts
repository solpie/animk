/// <reference path="BaseView.ts"/>
/// <reference path="SettingView.ts"/>

class PopupView {
    settingView:SettingView;

    constructor() {

    }

    initSettingView() {
        this.settingView = new SettingView();
        $(ElmId$.fileMenuOption).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.OpenSettingWin);
        });
    }
}