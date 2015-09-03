var MODES = [
    'BitMap',       //0
    'Grayscale',    //1
    'Indexed',      //2
    'RGB',          //3
    'CMYK',         //4
    undefined,      //5
    undefined,      //6
    'Multichannel', //7
    'Duotone',      //8
    'Lab'           //9
];
class PsdParser {
    constructor() {
    }

    _parseHeader(PSD) {
        var _ = PSD;

        var header = _.header = {
                sig: "",
                version: 0,
                channelsNum: 0,
                height: 0,
                width: 0,
                depth: 0,
                colorMode: 0,
            },
            file = _.file;

        header.sig = file.readString(4);
        if (header.sig !== '8BPS')
            throw 'This file seems not a psd file';

        header.version = file.readShort();
        if (header.version !== 1)
            throw 'This file seems not a psd file';

        file.seek(6); //reserved
        header.channelsNum = file.readShort();

        header.height = file.readInt();
        header.width = file.readInt();

        header.depth = file.readShort();

        header.colorMode = file.readShort();
        return PSD;
    }

    _parseColorMode(PSD) {
        var _ = PSD;


        var colorMode = _.colorMode = {
                startPos: 0,
                length: 0,
                endPos: 0,
            },
            file = _.file;

        colorMode.startPos = file.now();
        colorMode.length = file.readInt();

        file.seek(colorMode.length);

        colorMode.endPos = file.now();
        return PSD;
    }

    _parseImageResources(PSD) {

        var ref = [
                require('./resources/layer_links'),
                require('./resources/slices')
            ],

            Resources = {};

        ref.forEach(function(o){
            Resources[o.id] = o;
        });
        var _ = PSD;

        var imageResources = _.imageResources = {
                startPos:0,
                length:0,
                endPos:0,
                imageResourceBlock:null,
            },
            file = _.file;

        var startPos = imageResources.startPos = file.now(),
            length = imageResources.length = file.readInt();

        var endPos = startPos + length;
        var block = imageResources.imageResourceBlock = {};

        while (file.now() < endPos) {
            var sig = file.readString(4),
                id = file.readShort(),
                nameSize = file.readByte(),//pascal string; first byte meas length
                nameLength = file.pad2(nameSize === 0 ? 1 : nameSize) - 1,
                name = file.readString(nameLength),
                size = file.pad2(file.readInt()); //data length


            if (Resources[id]) {
                block[id] = Resources[id].parse(file, size);
            } else {
                file.seek(size);
            }
        }
        imageResources.endPos = file.now();
    }
}