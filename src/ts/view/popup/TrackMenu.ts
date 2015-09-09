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

        $(ElmId$.trackMenuMoveDown).on(MouseEvt.CLICK, ()=> {
            this._swapTrack(1);
        });
        $(ElmId$.trackMenuMoveUp).on(MouseEvt.CLICK, ()=> {
            this._swapTrack(-1);
        });
    }

    _swapTrack(deltaIdx:number) {
        var trackInfo:TrackInfo = appInfo.curComp().getSelTrackInfo();
        if (trackInfo) {
            var trackInfoB:TrackInfo;
            if (deltaIdx > 0) {
                for (var i = trackInfo.idx2() + deltaIdx; i < appInfo.curComp().trackInfoArr.length; i++) {
                    trackInfoB = appInfo.curComp().trackInfoArr[i];
                    if (trackInfoB) {
                        break;
                    }
                    else {
                        console.log(this, "no track in", i);
                    }
                }
            }
            else {
                for (var i = trackInfo.idx2() + deltaIdx; i > -1; i--) {
                    trackInfoB = appInfo.curComp().trackInfoArr[i];
                    if (trackInfoB) {
                        break;
                    }
                    else {
                        console.log(this, "no track in", i);
                    }
                }
            }
            if (trackInfoB)
                appInfo.projectInfo.curComp.swapTrack(trackInfo.idx2(), trackInfoB.idx2());
            this.hide();
        }
    }

    setTrackActType(type:number) {
        var trackInfo:TrackInfo = appInfo.projectInfo.curComp.getSelTrackInfo();
        if (trackInfo) {
            trackInfo.actType(type);
            this.hide();
        }
    }

    _onShow() {
        var menuHeight = this.menuHeight;
        var top = appInfo.mouseY;
        console.log(this, appInfo.height(), top, menuHeight);
        var trackInfo:TrackInfo = appInfo.projectInfo.curComp.getSelTrackInfo();
        if (trackInfo) {
            $(this.id$ + " " + ElmClass$.MenuTitle).html(trackInfo.name());
        }
        if (appInfo.height() - top < menuHeight) {
            top = top - menuHeight;
        }
        this.left(appInfo.mouseX);
        this.top(top);
        this.setMousePass(true);
    }
}