/// <reference path="BasePopup.ts"/>

class TrackMenu extends BasePopup {
    menuHeight:number;

    constructor() {
        super('template/TrackMenu.html', ElmId$.popupLayer, ElmId$.trackMenu);
        cmd.on(CommandId.ShowTrackMenu, ()=> {
            this.show();
        });
    }

    _onLoad() {
        this.menuHeight = $(this.id$).height();

        $(ElmId$.trackMenuNoEdit).on(MouseEvt.CLICK, ()=> {
            this.setTrackActType(ImageTrackActType.NOEDIT)
        });
        $(ElmId$.trackMenuNormal).on(MouseEvt.CLICK, ()=> {
            this.setTrackActType(ImageTrackActType.NORMAL)
        });
        $(ElmId$.trackMenuReference).on(MouseEvt.CLICK, ()=> {
            this.setTrackActType(ImageTrackActType.REF)
        });
    }

    setTrackActType(type:number) {
        var trackInfo:TrackInfo = appInfo.projectInfo.curComp.getSelTrackInfo();
        if (trackInfo) {
            trackInfo.actType(type);
            console.log(this, trackInfo, trackInfo.name())
            this.hide();
        }
    }

    _onShow() {
        var menuHeight = this.menuHeight;
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