function calculate(_) {
    var length,
        width = _.header.width,
        height = _.header.height,
        channels = _.header.channelsNum;
    switch (_.header.depth) {
        case 1  :
            length = (width + 7) / 8 * height;
            break;
        case 16 :
            length = width * height * 2;
            break;
        default :
            length = width * height;
            break;
    }
    length *= channels;

    return length;
}

function processData(data, channels) {
    //��image data section�����ݴ����ͨ����ʽ
    var channelInfo = [],
        len = data.length / channels; //һ��ͨ���ĳ���
    for (var i = 0; i < channels; i++) {
        channelInfo.push({
            id: i,
            data: data.splice(0, len)
        })
    }

    return channelInfo
}


class PsdRaw {
    //export
    static func(PSD) {
        return processData(PSD.file.read(calculate(PSD)), PSD.header.channelsNum)
    }
}