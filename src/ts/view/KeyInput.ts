class KeyInput {
    static isBlock:boolean;

    static onKeyDown(e) {
        var key = e.keyCode;
        var isCtrl = e.ctrlKey;
        var isShift = e.shiftKey;
        var isAlt = e.altKey;
        if (Keys.ESC(key)) {
            KeyInput.isBlock = false;
            appInfo.projectInfo.curComp.stayBack();
            cmd.emit(CommandId.HideConsoleWin);
        }
        if (KeyInput.isBlock) {
            console.log(this, "KeyInput Block");
            return;
        }
        if (Keys.Char(key, "F")) {
            appInfo.projectInfo.curComp.forward()
        }
        else if (Keys.Char(key, "D")) {
            appInfo.projectInfo.curComp.backward()
        }
        else if (Keys.Space(key)) {//Space
            appInfo.projectInfo.curComp.toggle();
        }
        else if (Keys.Char(key, "\r")) {//enter
            appInfo.tm.watchCurFrame();
        }
        /// project open save
        else if (Keys.Char(key, "O") && isCtrl) {//enter
            cmd.emit(CommandId.FileMenuOpen);
        }
        else if (Keys.Char(key, "S") && isCtrl) {//enter
            cmd.emit(CommandId.FileMenuSave);
        }
        else if (Keys.GraveAccent(key)) {//"`"
            KeyInput.isBlock = true;
            cmd.emit(CommandId.ShowConsoleWin);
        }
    }
}