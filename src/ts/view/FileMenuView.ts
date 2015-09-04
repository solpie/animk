/// <reference path="BaseView.ts"/>

class FileMenuView {
    _isShow:boolean = false;

    constructor() {
        cmd.on(CommandId.FileMenuOpen, ()=> {
            this.fileMenuOpen();
        });
        cmd.on(CommandId.FileMenuSave, (path)=> {
            this.fileMenuSave(path);
        });
        cmd.on(CommandId.ToggleFileMenu, ()=> {
            this._isShow = !this._isShow;
            if (this._isShow) {
                $(ElmId$.fileMenu).show();
            }
            else {
                $(ElmId$.fileMenu).hide();
            }
        });

        $(ElmId$.fileMenu).on(MouseEvt.UP, ()=> {
            $(ElmId$.fileMenu).hide();
            this._isShow = false;
        });
    }

    fileMenuOpen() {
        chooseFile(ElmId$.openFileDialog).change(()=> {
            var filename = $(ElmId$.openFileDialog).val();
            console.log(this, "open project file", filename);
            appInfo.openProject(filename);
        });
    }

    fileMenuSave(path?) {
        if (isdef(path)) {
            appInfo.projectInfo.save(path)
        }
        else {
            chooseFile(ElmId$.saveAsDialog).change(()=> {
                var filename = $(ElmId$.saveAsDialog).val();
                console.log(this, "save as", filename);
                appInfo.projectInfo.save(filename);
            });
        }
    }
}