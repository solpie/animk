/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../util/JSONFile.ts"/>
/// <reference path="CompositionInfo.ts"/>

class ProjectInfo extends EventDispatcher {
    comps:Array<CompositionInfo> = [];
    curComp:CompositionInfo;
    version:string = '0.1.0';

    constructor(options?) {
        super();
        console.log("new project");
    }


    newComp():CompositionInfo {
        this.curComp = new CompositionInfo();
        this.comps.push(this.curComp);
        this.curComp.name = "Comp" + this.comps.length;
        this.dis(CompInfoEvent.NEW_COMP);
        return this.curComp;
    }

    save(path) {
        var projData = {
            linanil: {
                version: this.version,
                setting: {},
                composition: []
            }
        };
        //console.log(this, "save", projData);
        for (var i = 0; i < this.comps.length; i++) {
            var compInfo:CompositionInfo = this.comps[i];
            var compData = {};
            compData.name = compInfo.name;
            compData.tracks = [];
            for (var j = 0; j < compInfo.trackInfoArr.length; j++) {
                var trackInfo:TrackInfo = compInfo.trackInfoArr[j];
                if (trackInfo) {
                    var trackData = {};
                    trackData.name = trackInfo.name;
                    trackData.opacity = trackInfo.opacity;
                    trackData.enable = trackInfo.enable;
                    trackData.start = trackInfo.getStart();
                    trackData.end = trackInfo.getEnd();
                    compData.tracks.push(trackData);
                }
            }
            projData.linanil.composition.push(compData);
        }

        jsonfile.writeFile(path, projData, function (err) {
            //console.error(err)
        });

    }
}