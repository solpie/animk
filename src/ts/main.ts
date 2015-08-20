/// <reference path="JQuery.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="view/AppView.ts"/>

var app:AnimkView;
// Load the application once the DOM is ready, using `jQuery.ready`:
$(() => {
    // Finally, we kick things off by creating the **App**.
    app = new AnimkView(appInfo);
    appInfo.test();

});

