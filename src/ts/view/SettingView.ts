/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="BaseView.ts"/>
/// <reference path="../Model/Command.ts"/>

class SettingView extends BasePopup {
    btnToPageArr;
    _isInit = false;

    constructor() {
        super('template/SettingWin.html', ElmId$.popupLayer);
        cmd.on(CommandId.OpenSettingWin, ()=> {
            this.show();
        });
    }

    _onLoad() {
        this.btnToPageArr = [];
        this.btnToPageArr.push([ElmId$.tabButton0, ElmId$.tabPage0]);
        this.btnToPageArr.push([ElmId$.tabButton1, ElmId$.tabPage1]);
        this.btnToPageArr.push([ElmId$.tabButton2, ElmId$.tabPage2]);
        var onClickBtn = (e)=> {
            var btnTarget$ = $(e.target);
            this.showTabByAttrId(btnTarget$.attr("id"));
        };
        for (var i = 0; i < this.btnToPageArr.length; i++) {
            var btnToPage = this.btnToPageArr[i];
            $(btnToPage[1]).hide();
            $(btnToPage[0]).on(MouseEvt.CLICK, onClickBtn);
        }


        $(ElmId$.btnCloseSetting).on(MouseEvt.CLICK, ()=> {
            $(ElmId$.settingWin).hide();
            $(ElmId$.popupLayer).hide();
        });
        this.showTabByAttrId($(ElmId$.tabButton0).attr("id"))
    }

    showTabByAttrId(id:string) {
        for (var i = 0; i < this.btnToPageArr.length; i++) {
            var btnToPage = this.btnToPageArr[i];
            var btn$ = $(btnToPage[0]);
            var page$ = $(btnToPage[1]);
            if (btn$.attr("id") == id) {
                page$.show();
                btn$.css({background: "#555"});
            }
            else {
                page$.hide();
                btn$.css({background: "#222"});
            }
        }
    }

    setPage(idx:number) {

    }
}