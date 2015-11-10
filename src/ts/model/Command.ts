/// <reference path="../event/EventDispatcher.ts"/>
enum CommandId{
    ShowConsoleWin = 100000,
    //test cmd
    testSwapTrack,
    testNewProject,
    testSaveProject,
    testProject,
    testRender,
    testDialog,
    //
    HideConsoleWin,
    ShowSettingWin,
    ToggleFileMenu,
    FileMenuOpen,
    FileMenuSave,
    ShowOnHoldWin,
    ShowTrackMenu,
    HideTrackMenu,
    ShowDialogOK,
    HideDialogOK,

    ShowNewPngWin,
    HideNewPngWin,
    //frame cmd
    InsertFrame,
    DeleteFrame,
    ZoomOutMax,
    ZoomInMax,

}
class CommandItem {
    id:number;
    name:string;
    desc:string;

    constructor(id) {
        this.id = id;
    }
}
class Command extends EventDispatcher {
    cmdArr:Array<CommandItem>;

    constructor() {
        super();
        this.cmdArr = [];
        this.newCmd(CommandId.ShowSettingWin, "open Option");
        this.newCmd(CommandId.FileMenuOpen, "open Project");
        this.newCmd(CommandId.FileMenuSave, "save Project");
        //
        this.newCmd(CommandId.ShowOnHoldWin, "open on hold win");

        this.newCmd(CommandId.ShowTrackMenu, "show track menu");
        this.newCmd(CommandId.HideTrackMenu, "hide track menu");
        //frame cmd
        this.newCmd(CommandId.InsertFrame, "insert frame");
        this.newCmd(CommandId.DeleteFrame, "delete frame");
        //zoom
        this.newCmd(CommandId.ZoomOutMax, "zoom out max");
        ////test cmd

        this.newCmd(CommandId.testSwapTrack, "test swap track");
        this.newCmd(CommandId.testNewProject, "test new project");
        this.newCmd(CommandId.testSaveProject, "test save project");
        this.newCmd(CommandId.testProject, "test project");
        this.newCmd(CommandId.testRender, "test render");
        this.newCmd(CommandId.testDialog, "test dialog");
    }

    newCmd(id:number, name:string, desc?:string) {
        var ci = new CommandItem(id);
        ci.name = name;
        ci.desc = desc;
        this.cmdArr.push(ci);
    }
}