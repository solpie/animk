class Test {
    constructor(cmd:Command, appInfo:AppInfo) {
        cmd.on(CommandId.testSwapTrack, ()=> {
            appInfo.projectInfo.curComp.swapTrack(2, 1);
        });

        cmd.on(CommandId.testRender, ()=> {
            var option = new RenderOption();
            option.path = "D:/projects/animk/test/render";
            option.start = 1;
            option.end = 5;
            appInfo.curComp().render(option);
        });

        cmd.on(CommandId.testProject, ()=> {
            appInfo.projectInfo.open('../test/data.json');
        });
        cmd.on(CommandId.testDialog, ()=> {
            var dialogItem = new DialogItem();
            dialogItem.content = "can you here me?";

            dialogItem.callbackOK = function () {
                console.log(this, "yes");
            };

            dialogItem.callbackCancel = function () {
                console.log(this, "no");
            };

            cmd.emit(CommandId.ShowDialogOK, dialogItem);
        });

        cmd.on(CommandId.testSaveProject, ()=> {
            appInfo.projectInfo.save('D:/projects/animk/test/data.json')
        });
        cmd.on(CommandId.testNewProject, ()=> {
            appInfo.newProject();
            appInfo.projectInfo.newComp(1280, 720, 24).newTrack('D:/projects/animk/test/test30');
            appInfo.projectInfo.curComp.newTrack('D:/projects/animk/test/test10');
            appInfo.projectInfo.curComp.setCursor(1);
        });
    }
}