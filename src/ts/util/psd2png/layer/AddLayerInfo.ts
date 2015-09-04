var _layerId = {
    id: 'lyid',
    parse: function (file) {
        return file.readInt()
    }
};
var _layerName = {
    id: 'luni',
    parse: function (file) {
        return file.readUnicodeString();
    }
};
///
/// <reference path="../Descriptor.ts"/>
//parseEngineData = require('parse-engine-data');

var _typeTool = {
    id: 'TySh',
    parse: function (file) {
        //var version = file.readShort(),
        //    transform = {
        //        xx: file.readDouble(),
        //        xy: file.readDouble(),
        //        yx: file.readDouble(),
        //        yy: file.readDouble(),
        //        tx: file.readDouble(),
        //        ty: file.readDouble()
        //    },
        //    textVer = file.readShort(),
        //    descVer1 = file.readInt();
        //var textData = new Descriptor().init(file),
        //    warpVer = file.readShort(),
        //    descVer2 = file.readInt();
        //
        //warpData = new Descriptor().init(file);
        //
        //var coords = {
        //    left: file.readDouble(),
        //    top: file.readDouble(),
        //    right: file.readDouble(),
        //    bottom: file.readDouble()
        //};
        //
        ////textData.EngineData = parseEngineData(textData.EngineData);
        //
        //return {
        //    transform: transform,
        //    textData: textData,
        //    warpData: warpData,
        //    coordinate: coords
        //}
    }
};
///
var _sectionDivider = {
    id: 'lsct',
    parse: function (file) {
        var type = file.readInt();
        file.seek(4); // sig
        var blendMode = file.readInt(),
            subType = file.readInt();

        return {
            type: type,
            blendMode: blendMode,
            subType: subType
        }
    }
};
var ref = [
        _layerId,
        _layerName,
        _typeTool,
        _sectionDivider
    ],

    LAYER_INFO = {};

ref.forEach(function (o) {
    LAYER_INFO[o.id] = o;
});

function parseAdditional(file, endPos) {
    var o = {};
    while (file.now() < endPos) {
        var sig = file.readString(4),
            key = file.readString(4),
            len = file.pad2(file.readInt()),
            end = file.now() + len;

        if (LAYER_INFO[key]) {
            o[key] = LAYER_INFO[key].parse(file);
        }
        file.seek(end - file.now());
    }

    return o;
}