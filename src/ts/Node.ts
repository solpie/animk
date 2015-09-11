declare var require:{
    (val:string):any;
};
var fs = require('fs');
var Stream = require('stream');
var zlib = require('zlib');
//var data = fs.read('c:/test.xml');
function walk(path):Array<string> {
    var fileArr = [];
    var dirArr = fs.readdirSync(path);
    dirArr.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
            //walk(path + '/' + item);
        } else {
            var filename = path + '/' + item;
            fileArr.push({filename: filename});
            console.log("file:", filename);
        }
    });
    return fileArr;
}
declare class Buffer {
    constructor(val?, encoding?);

    static concat(val?);

    fill(val);

    length:number;

    write(str:string, ofs?);

    writeUInt8(val1, val2?);

    writeUInt16BE(val1, val2?);

    writeUInt32BE(val1, val2?);

    writeInt32BE(val1, val2?);

    writeInt16BE(value, offset?);

    slice(val1, val2);
}


//walk('D:/projects/linAnil/test/test10');
//fs.mkdir("c:a", function (err) {
//    if (!err) {
//        console.log("sus");
//    } else {
//        console.log("err");
//    }
//});
//console.log('main',data);


////////////// path
var M_path = require("path");


////////////// macro
var isdef = function (val) {
    return val != undefined
};
var prop = function (obj, paramName, v, callback?) {
    if (isdef(v)) {
        obj[paramName] = v;
        if (callback)
            callback();
    }
    else
        return obj[paramName]
};

var writeBuffer = function (path, buffer, callback) {
    fs.open(path, 'w', null, function (err, fd) {
        if (err) {
            throw err;
        }
        fs.write(fd, buffer, 0, buffer.length, null, function (err) {
            if (err) {
                throw err;
            }
            fs.close(fd, function () {
                callback();
            });
        });
    });
};

