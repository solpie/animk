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
class Header {
    constructor() {
    }

    get(PSD) {
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
}