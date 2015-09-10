/// <reference path="BasePopup.ts"/>

class SettingView extends BasePopup {
    btnToPageArr;
    _isInit = false;

    constructor() {
        super('template/SettingWin.html', ElmId$.popupLayer, ElmId$.settingWin);
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
            this.hide();
        });

        this.showTabByAttrId($(ElmId$.tabButton0).attr("id"));
        this._pagePath();
    }

    _pagePath() {
        //set tmp path
        appInfo.settingInfo.on(SettingInfoEvent.SET_TMP_PATH, ()=> {
            $(ElmId$.settingTmpPathText).val(appInfo.settingInfo.tmpPath());
        });

        $(ElmId$.settingTmpPathBtn).on(MouseEvt.CLICK, ()=> {
            chooseFile(ElmId$.openFileDialog).change(function () {
                var filename = $(ElmId$.openFileDialog).val();
                appInfo.settingInfo.tmpPath(filename);
            });
        });
        //set draw app
        appInfo.settingInfo.on(SettingInfoEvent.SET_DRAW_APP1, ()=> {
            $(ElmId$.settingDrawApp1Text).val(appInfo.settingInfo.drawApp1Path());
        });

        $(ElmId$.settingDrawApp1Btn).on(MouseEvt.CLICK, ()=> {
            chooseFile(ElmId$.openFileDialog).change(function () {
                var filename = $(ElmId$.openFileDialog).val();
                appInfo.settingInfo.drawApp1Path(filename);
            });
        });

    }

    _onShow() {
        $(ElmId$.settingTmpPathText).val(appInfo.settingInfo.tmpPath());
        $(ElmId$.settingDrawApp1Text).val(appInfo.settingInfo.drawApp1Path());
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