/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="CompositionInfo.ts"/>

class ProjectInfo extends EventDispatcher {
    comps:Array<CompositionInfo>;
    curComp:CompositionInfo;
    constructor(options?) {
        super();
        console.log("new project");
    }

    newComp():CompositionInfo {
        this.curComp = new CompositionInfo();
        this.dis("newComp");
        return this.curComp;
    }

}