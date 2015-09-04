/// <reference path="SettingView.ts"/>

class PopupView {
    settingView:SettingView;

    constructor() {

    }

    initSettingView() {
        this.settingView = new SettingView();
        $(ElmId$.fileMenuOption).on(MouseEvt.CLICK, ()=> {
            this.settingView.show();
        });
    }
}