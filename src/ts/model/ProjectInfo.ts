/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../util/JSONFile.ts"/>
/// <reference path="CompositionInfo.ts"/>

class ProjectInfo extends EventDispatcher {
    comps:Array<CompositionInfo> = [];
    curComp:CompositionInfo;
    version:string = '0.1.0';

    constructor(options?) {
        super();
    }


    newComp(width, height, framerate):CompositionInfo {
        this.curComp = new CompositionInfo(width, height, framerate);
        this.comps.push(this.curComp);
        this.curComp.name = "Comp" + this.comps.length;
        this.dis(CompInfoEvent.NEW_COMP, this.curComp);
        return this.curComp;
    }

    /////////////////////// open project
    open(path) {
        console.log(this, "open project", path);
        jsonfile.readFile(path, (err, projData)=> {
            console.log(this, "open project ver:", projData.linAnil.version);
            this.version = projData.linAnil.version;

            for (var i = 0; i < projData.linAnil.composition.length; i++) {
                var compData:CompositionData = projData.linAnil.composition[i];
                var compInfo:CompositionInfo = this.newComp(compData.width, compData.height, compData.framerate);
                for (var j = 0; j < compData.tracks.length; j++) {
                    var trackData:TrackData = compData.tracks[j];
                    var path = trackData.path;
                    for (var k = 0; k < trackData.frames.length; k++) {
                        var frameData:FrameData = trackData.frames[k];
                        frameData.filename = M_path.join(path, frameData.filename);
                    }
                    compInfo.newTrackByTrackData(trackData.frames, path, trackData.name)
                }
            }
        });


    }

    save(path) {
        var projData = {
            linAnil: {
                version: this.version,
                setting: {},
                composition: []
            }
        };
        for (var i = 0; i < this.comps.length; i++) {
            var compInfo:CompositionInfo = this.comps[i];
            if (!compInfo)
                continue;
            var compData:CompositionData = {
                name: compInfo.name,
                framerate: compInfo.framerate,
                framewidth: compInfo.frameWidth,
                height: compInfo.height,
                width: compInfo.width,
                tracks: []
            };
            projData.linAnil.composition.push(compData);
            for (var j = 0; j < compInfo.trackInfoArr.length; j++) {
                var trackInfo:TrackInfo = compInfo.trackInfoArr[j];
                if (!trackInfo)
                    continue;
                var trackData:TrackData = {
                    name: trackInfo.name,
                    opacity: trackInfo.opacity,
                    enable: trackInfo.enable,
                    start: trackInfo.getStart(),
                    loopType: trackInfo.loopType,
                    end: trackInfo.getEnd(),
                    path: trackInfo.path,
                    frames: [],
                };
                compData.tracks.push(trackData);
                for (var k = 0; k < trackInfo.frameInfoArr.length; k++) {
                    var frameInfo:FrameInfo = trackInfo.frameInfoArr[k];
                    if (!frameInfo)
                        continue;
                    var frameData:FrameData = {
                        start: frameInfo.getStart(),
                        hold: frameInfo.getHold(),
                        filename: M_path.basename(frameInfo.imageInfo.filename),
                    };
                    trackData.frames.push(frameData)
                }
            }
        }

        jsonfile.writeFile(path, projData, function (err) {
            //console.error(err)
        });

    }
}