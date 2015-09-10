/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
class SettingData {
    tmpPath:string = "c:/tmp";
    drawApp1Path:string = "";
    drawApp2Path:string = "";
}

class SettingInfo extends EventDispatcher {
    settingData:SettingData;

    constructor() {
        super();
        this.settingData = new SettingData();
    }

    tmpPath(v?) {
        return prop(this.settingData, "tmpPath", v, ()=> {
            this.emit(SettingInfoEvent.SET_TMP_PATH)
        })
    }

    drawApp1Path(v?) {
        return prop(this.settingData, "drawApp1Path", v, ()=> {
            this.emit(SettingInfoEvent.SET_DRAW_APP1)
        })
    }
}