class SettingData {
    tmpPath:string = "c:/tmp"
}

class SettingInfo {
    settingData:SettingData;

    constructor() {
        this.settingData = new SettingData();
    }
}