/// <reference path="../event/EventDispatcher.ts"/>

class ProjectInfo extends EventDispatcher {
    comps:Array<CompositionInfo>;
    curComp:CompositionInfo;
    constructor(options?) {
        super();
        console.log("new project");
    }

    newComp():CompositionInfo {
        this.curComp = new CompositionInfo();
        return this.curComp;
    }

}