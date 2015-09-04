/// <reference path="../event/EventDispatcher.ts"/>
enum CommandId{
    ShowConsoleWin = 100000,
    HideConsoleWin,
    OpenSettingWin,
    FileMenuOpen,
    FileMenuSave,
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
    }

    newCmd(id:number, name:string, desc?:string) {
        var ci = new CommandItem(id);
        ci.name = name;
        ci.desc = desc;
        this.cmdArr.push(ci);
    }
}