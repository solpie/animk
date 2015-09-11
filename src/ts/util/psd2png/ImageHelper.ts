/// <reference path="imageFormat/PsdRaw.ts"/>

function _layerRaw(layer, file) {
    return file.read((layer.right - layer.left) * (layer.bottom - layer.top))
}
//./imageFormat/layerRLE
function decodeRLE(height, file, bytes) {
    var byteCount, endPos, len;
    var data = [], val;
    for (var i = 0; i < height; i++) {
        byteCount = bytes[i];
        endPos = file.now() + byteCount;

        while (file.now() < endPos) {
            len = file.readByte();
            //i don`t know
            if (len < 128) {
                len++;

                data.splice.apply(data, [data.length, 0].concat([].slice.call(file.read(len))));

            }
            else if (len > 128) {
                len ^= 0xff;
                len += 2;
                val = file.readByte();
                for (var l = 0; l < len; l++) {
                    data.push(val);
                }
            }
            //            else len==128 do nothing;
        }
    }
    return data
}
function parseByteCounts(height, file) {
    var temp = [];
    for (var i = 0; i < height; i++) {
        temp.push(file.readShort());
    }
    return temp;
}
function _layerRLE(layer, file) {
    return decodeRLE(layer.height, file, parseByteCounts(layer.height, file))
}
///./imageFormat/psdRaw
function _psdRaw(PSD) {
    return processData(PSD.file.read(calculate(PSD)), PSD.header.channelsNum)
}

///./imageFormat/psdRLE
function parseByteCountsCh(height, channels, file) {
    var temp = [];

    for (var i = 0; i < channels * height; i++) {
        temp.push(file.readShort());
    }
    return temp
}
function _psdRLE(PSD) {
    var _ = PSD;

    var channels = _.header.channelsNum,
        height = _.header.height,
        file = _.file;

    var byteCounts = parseByteCountsCh(height, channels, file);
    var channelInfo = [];
    for (var i = 0; i < channels; i++) {
        //将 RRR GGG BBB 处理为通道模式
        /*
         * 根据通道的方式处理
         * 每次只处理一个通道
         * decodeRLE中根据通道处理
         * */

        channelInfo.push({
            id: i,
            data: decodeRLE(height, file, byteCounts.slice(height * i, height * (i + 1)))
        });

    }
    return channelInfo
}
///./imageMode/rgb
//function _imageMode(layer) {
//
//    var pixelNum = (layer.width + layer.left) * (layer.height + layer.top);
//    console.log("imageMerge top", layer.top);
//    var pixelData = [];
//    var a, r, g, b;
//
//    for (var j = 0; j < pixelNum; j++) {
//        a = 255;
//        r = g = b = 0;
//        for (var i = 0; i < layer.channelInfo.length; i++) {
//            var v = layer.channelInfo[i];
//            switch (v.id) {
//                case -1:
//                    a = v.data[j];
//                    break;
//                case  0:
//                    r = v.data[j];
//                    break;
//                case  1:
//                    g = v.data[j];
//                    break;
//                case  2:
//                    b = v.data[j];
//                    break;
//            }
//        }
//        pixelData.push(r, g, b, a);
//    }
//
//
//    var make2Arr = function (w, h) {
//        var a = [];
//        for (var y = 0; y < h; y++) {
//            var l = [];
//            for (var x = 0; x < w; x++) {
//                l.push({r: 0, g: 0, b: 0, a: 0})
//            }
//            a.push(l);
//        }
//        return a;
//    };
//    var contentW = layer.width + layer.left;
//    var contentH = layer.height + layer.top;
//    var pixelData2 = make2Arr(layer.width + contentW, layer.height + contentH);
//    for (var y = 0; y < layer.height; y++) {
//        for (var x = 0; x < layer.width; x++) {
//            var idx = (layer.width * y + x) << 2;
//            var rgba = pixelData2[y + layer.top][x + layer.left];
//            rgba.r = pixelData[idx];//red
//            rgba.g = pixelData[idx + 1];//red
//            rgba.b = pixelData[idx + 2];//red
//            rgba.a = pixelData[idx + 3];//red
//        }
//    }
//    pixelData = [];
//    for (var y = 0; y < layer.height + contentH; y++) {
//        for (var x = 0; x < layer.width + contentW; x++) {
//            var rgba = pixelData2[y][x];
//            pixelData.push(rgba.r, rgba.g, rgba.b, rgba.a);
//        }
//    }
//    return pixelData
//}
function _imageMode(layer) {
    var pixelNum = layer.width * layer.height;

    console.log("imageMerge top", layer.top);
    var pixelData = [];
    var a, r, g, b;
    for (var j = 0; j < pixelNum; j++) {
        a = 255;
        r = g = b = 0;
        for (var i = 0; i < layer.channelInfo.length; i++) {
            var v = layer.channelInfo[i];

            switch (v.id) {
                case -1:
                    a = v.data[j];
                    break;
                case  0:
                    r = v.data[j];
                    break;
                case  1:
                    g = v.data[j];
                    break;
                case  2:
                    b = v.data[j];
                    break;
            }
        }
        pixelData.push(r, g, b, a);
    }
    return pixelData
}
var imageFun = {
    //image 函数集合
    layerFormat: [
        //0=Raw 1=RLE 2=ZIP without prediction 3=ZIP with prediction
        _layerRaw,
        _layerRLE
    ],
    PSDFormat: [
        //0=Raw 1=RLE 2=ZIP without prediction 3=ZIP with prediction
        _psdRaw,
        _psdRLE
    ],
    Mode: {
        '3': _imageMode
    },

    mergeImageData: function (layer, colorMode) {
        if (this.Mode[colorMode])
            return this.Mode[colorMode](layer);

        throw 'Not support the colorMode';
    }
};