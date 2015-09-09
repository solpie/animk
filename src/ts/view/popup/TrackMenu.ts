/// <reference path="BasePopup.ts"/>

class TrackMenu extends BasePopup {
    constructor() {
        super('template/TrackMenu.html', ElmId$.popupLayer, ElmId$.trackMenu);
        cmd.on(CommandId.ShowTrackMenu, ()=> {
            this.show();
        });
    }

    _onShow() {
        var menuHeight = $(this.id$).height();
        var top = appInfo.mouseY;
        console.log(this, appInfo.height(), top, menuHeight);

        if (appInfo.height() - top < menuHeight) {
            top = top - menuHeight;
        }
        this.left(appInfo.mouseX);
        this.top(top);
        this.setMousePass(true);
    }
}