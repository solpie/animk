/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="BaseView.ts"/>

class SettingView extends BaseView {
    constructor() {
        super();
        var btnToPageArr = [];
        btnToPageArr.push([ElmId$.tabButton0, ElmId$.tabPage0]);
        btnToPageArr.push([ElmId$.tabButton1, ElmId$.tabPage1]);
        btnToPageArr.push([ElmId$.tabButton2, ElmId$.tabPage2]);
        var onClickBtn = (e)=> {
            var btnTarget$ = $(e.target);
            for (var i = 0; i < btnToPageArr.length; i++) {
                var btnToPage = btnToPageArr[i];
                var btn$ = $(btnToPage[0]);
                var page$ = $(btnToPage[1]);
                if (btn$.attr("id") == btnTarget$.attr("id")) {
                    page$.css({display: "block"});
                    btn$.css({background: "#555"});
                }
                else {
                    page$.css({display: "none"});
                    btn$.css({background: "#222"});
                }
            }
        };
        for (var i = 0; i < btnToPageArr.length; i++) {
            var btnToPage = btnToPageArr[i];
            $(btnToPage[0]).on(MouseEvt.CLICK, onClickBtn);
        }

    }

    setPage(idx:number) {

    }
}