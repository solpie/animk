/// <reference path="JQuery.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="model/Command.ts"/>
/// <reference path="view/AppView.ts"/>
/// <reference path="test.ts"/>
var cmd:Command = new Command();
var appInfo = new AppInfo();
var app:AnimkView;
// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    app = new AnimkView(appInfo);
    app.onDomReady();
    new Test(cmd,appInfo);
});