/**
 * Created by Gqb on 14/11/16.
 */
/// <reference path="Mask.ts"/>
/// <reference path="BlendingRange.ts"/>
/// <reference path="AddLayerInfo.ts"/>

//var parseMask = require('./mask'),
//    parseBlendingRange = require('./blendingRange'),
//    parseAdditional = require('./addLayerInfo');

var MODES = {
    'pass': 'pass through',
    'norm': 'normal',
    'diss': 'dissolve',
    'dark': 'darken',
    'mul ': 'multiply',
    'idiv': 'color burn',
    'lbrn': 'linear burn',
    'dkCl': 'darker color',
    'lite': 'lighten',
    'scrn': 'screen',
    'div ': 'color dodge',
    'lddg': 'linear dodge',
    'lgCl': 'lighter color',
    'over': 'overlay',
    'sLit': 'soft light',
    'hLit': 'hard light',
    'vLit': 'vivid light',
    'lLit': 'linear light',
    'pLit': 'pin light',
    'hMix': 'hard mix',
    'diff': 'difference',
    'smud': 'exclusion',
    'fsub': 'subtract',
    'fdiv': 'divide',
    'hue ': 'hue',
    'sta ': 'saturation',
    'colr': 'color',
    'lum ': 'luminosity'
};
class Records {
    static parseLayer(file) {
        var top = file.readInt(),
            left = file.readInt(),
            bottom = file.readInt(),
            right = file.readInt();

        var channelCount = file.readShort();

        var channelInfo = [];
        for (var i = 0; i < channelCount; i++) {
            var o = {
                id: 0,
                length: 0
            };
            o.id = file.readShort();
            o.length = file.readInt(); //data Length
            channelInfo.push(o);
        }

        var blendModeSig = file.readString(4),
            blendModeKey = file.readString(4),
            opacity = file.readByte(),
            clipping = file.readByte(),
            flag = file.readByte(),
            visible = !((flag & (0x01 << 1)) > 0),
            filler = file.readByte(),

            extraLen = file.readInt(),
            endPos = file.now() + extraLen;

        var layerMaskData = parseMask(file);
        var blendingRangesData = parseBlendingRange(file);

        var nameLength = file.pad4(file.readByte()) - 1,
            name = file.readString(nameLength);

        var additional = parseAdditional(file, endPos);

        file.seek(endPos - file.now());

        return {
            top: top,
            right: right,
            bottom: bottom,
            left: left,
            width: right - left,
            height: bottom - top,
            channelCount: channelCount,
            channelInfo: channelInfo,
            blendMode: MODES[blendModeKey],
            opacity: opacity,
            visible: visible,
            legacyName: name,
            additional: additional
        }
    }
}
//module.exports = function (file) {
//    var top = file.readInt(),
//        left = file.readInt(),
//        bottom = file.readInt(),
//        right = file.readInt();
//
//    var channelCount = file.readShort();
//
//    var channelInfo = [];
//    for (var i = 0; i < channelCount; i++) {
//        var o = {};
//        o.id = file.readShort();
//        o.length = file.readInt(); //data Length
//        channelInfo.push(o);
//    }
//
//    var blendModeSig = file.readString(4),
//        blendModeKey = file.readString(4),
//        opacity = file.readByte(),
//        clipping = file.readByte(),
//        flag = file.readByte(),
//        visible = !((flag & (0x01 << 1)) > 0),
//        filler = file.readByte(),
//
//        extraLen = file.readInt(),
//        endPos = file.now() + extraLen;
//
//    var layerMaskData = parseMask(file);
//    var blendingRangesData = parseBlendingRange(file);
//
//    var nameLength = file.pad4(file.readByte()) - 1,
//        name = file.readString(nameLength);
//
//    var additional = parseAdditional(file, endPos);
//
//    file.seek(endPos - file.now());
//
//    return {
//        top: top,
//        right: right,
//        bottom: bottom,
//        left: left,
//        width: right - left,
//        height: bottom - top,
//        channelCount: channelCount,
//        channelInfo: channelInfo,
//        blendMode: MODES[blendModeKey],
//        opacity: opacity,
//        visible: visible,
//        legacyName: name,
//        additional: additional
//    }
//};