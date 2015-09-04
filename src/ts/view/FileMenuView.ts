/// <reference path="BaseView.ts"/>

class FileMenuView {
    constructor() {
        cmd.on(CommandId.FileMenuOpen, ()=> {
            this.fileMenuOpen();
        });
        cmd.on(CommandId.FileMenuSave, ()=> {
            this.fileMenuSave();
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