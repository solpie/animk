class KeyInput {
    static onKeyDown(e) {
        var key = e.keyCode;
        var isCtrl = e.ctrlKey;
        var isShift = e.shiftKey;
        var isAlt = e.altKey;
        if (Keys.Char(key, "F")) {
            appInfo.projectInfo.curComp.forward()
        }
        else if (Keys.Char(key, "D")) {
            appInfo.projectInfo.curComp.backward()
        }
        else if (Keys.Space(key)) {//Space
            appInfo.projectInfo.curComp.toggle();
        }
        else if (Keys.ESC(key)) {//Space
            appInfo.projectInfo.curComp.stayBack();
            cmd.emit(CommandId.HideConsoleWin);
        }
        else if (Keys.Char(key, "\r")) {//enter
            appInfo.tm.watchAct();
        }
        /// project open save
        else if (Keys.Char(key, "O") && isCtrl) {//enter
            cmd.emit(CommandId.FileMenuOpen);
        }
        else if (Keys.Char(key, "S") && isCtrl) {//enter
            cmd.emit(CommandId.FileMenuSave);
        }
        else if (Keys.GraveAccent(key)) {//enter
            cmd.emit(CommandId.ShowConsoleWin);
        }
    }
}