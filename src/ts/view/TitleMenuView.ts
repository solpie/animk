/// <reference path="BaseView.ts"/>
class TitleMenuView extends BasePopup {

    constructor() {
        super('template/TitleMenu.html', ElmId$.titleMenu);
        this.show();

    }

    onLoad() {
        $(ElmId$.menuBtnFile).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.ToggleFileMenu);
        });

        $(ElmId$.fileMenuNew).on(MouseEvt.CLICK, ()=> {
        });

        $(ElmId$.fileMenuOpen).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.FileMenuOpen);
        });

        $(ElmId$.fileMenuSave).on(MouseEvt.CLICK, ()=> {
            if (appInfo.projectInfo.saveFilename)
                cmd.emit(CommandId.FileMenuSave, appInfo.projectInfo.saveFilename);
            //this.fileMenuSave(appInfo.projectInfo.saveFilename);
            else
                cmd.emit(CommandId.FileMenuSave);
        });

        $(ElmId$.fileMenuSaveAs).on(MouseEvt.CLICK, ()=> {
            cmd.emit(CommandId.FileMenuSave);
        });
    }
}