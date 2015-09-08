/// <reference path="../event/EventDispatcher.ts"/>
enum CommandId{
    ShowConsoleWin = 100000,
    testSwapTrack,
    testNewProject,
    testSaveProject,
    testProject,
    HideConsoleWin,
    OpenSettingWin,
    ToggleFileMenu,
    FileMenuOpen,
    FileMenuSave,
    OpenOnHoldWin,
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
        this.newCmd(CommandId.OpenSettingWin, "open Option");
        this.newCmd(CommandId.FileMenuOpen, "open Project");
        this.newCmd(CommandId.FileMenuSave, "save Project");
        //
        this.newCmd(CommandId.OpenOnHoldWin, "open on hold win");
        ////test cmd
        this.newCmd(CommandId.testSwapTrack, "test swap track");
        this.newCmd(CommandId.testNewProject, "test new project");
        this.newCmd(CommandId.testSaveProject, "test save project");
        this.newCmd(CommandId.testProject, "test project");
    }

    newCmd(id:number, name:string, desc?:string) {
        var ci = new CommandItem(id);
        ci.name = name;
        ci.desc = desc;
        this.cmdArr.push(ci);
    }
}