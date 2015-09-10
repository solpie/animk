/// <reference path="BasePopup.ts"/>

class DialogItem {
    title:string;
    content:string;
    callbackOK:any;
    callbackCancel:any;
}
class DialogOK extends BasePopup {
    _dialogItem:DialogItem;

    constructor() {
        super('template/DialogOK.html', ElmId$.popupLayer, ElmId$.dialogOK);

        cmd.on(CommandId.ShowDialogOK, (dialogItem:DialogItem)=> {
            this._dialogItem = dialogItem;
            this.show();
        });

        cmd.on(CommandId.HideDialogOK, ()=> {
            this.hide();
        });
    }

    _onLoad() {

        $(ElmId$.dialogOKBtnOK).on(MouseEvt.CLICK, ()=> {
            this._callOk();
        });

        $(ElmId$.dialogOKBtnCancel).on(MouseEvt.CLICK, ()=> {
            this._callCancel();
        });
    }

    _callOk() {
        if (this._dialogItem && this._dialogItem.callbackOK) {
            this._dialogItem.callbackOK();
        }
        this._close();
    }

    _callCancel() {
        if (this._dialogItem && this._dialogItem.callbackCancel) {
            this._dialogItem.callbackOK();
        }
        this._close();
    }
    _close(){
        this._dialogItem = null;
        this.hide();
    }

    _onShow() {
        if (this._dialogItem)
            $(ElmId$.dialogOKContent).html(this._dialogItem.content);
        var left = (appInfo.width() - this.width()) * .5;
        var top = (appInfo.height() - this.height()) * .5;
        this.top(top);
        this.left(left);
    }
}