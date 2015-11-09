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
        //var trackInfo:TrackInfo = appInfo.curComp().getActiveTrackInfo();
        //if (trackInfo) {
        //    var trackInfoB:TrackInfo;
        //    var compTrackInfoArr:Array<TrackInfo> = appInfo.curComp().getCompTrackInfoArr();
        //    if (deltaIdx > 0) {
        //        for (var i = 0; i < compTrackInfoArr.length; i++) {
        //            var tInfo:TrackInfo = compTrackInfoArr[i];
        //            if (tInfo && tInfo.layerIdx() > trackInfo.layerIdx()) {
        //                trackInfoB = tInfo;
        //                break;
        //            }
        //        }
        //    }
        //    else {
        //        for (var i = compTrackInfoArr.length - 1; i > -1; i--) {
        //            var tInfo:TrackInfo = compTrackInfoArr[i];
        //            if (tInfo && tInfo.layerIdx() < trackInfo.layerIdx()) {
        //                trackInfoB = tInfo;
        //                break;
        //            }
        //        }
        //    }
        //    if (trackInfoB)
        //        appInfo.projectInfo.curComp.swapTrack(trackInfo.idx2(), trackInfoB.idx2());
        appInfo.curComp().moveTrack(deltaIdx);
        this.hide();
        //}
    }

    setTrackActType(type:number) {
        var trackInfo:TrackInfo = appInfo.projectInfo.curComp.getActiveTrackInfo();
        if (trackInfo) {
            trackInfo.actType(type);
            this.hide();
        }
    }

    _onShow() {
        var menuHeight = this.menuHeight;
        var top = appInfo.mouseY;
        console.log(this, appInfo.height(), top, menuHeight);
        var trackInfo:TrackInfo = appInfo.projectInfo.curComp.getActiveTrackInfo();
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