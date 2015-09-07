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
    constructor(val?);

    static concat(val?);

    fill(val);

    length:number;
    write(str:string);
    writeUInt16BE(val1,val2?);
    writeUInt32BE(val1,val2?);
    writeInt32BE(val1,val2?);

    writeInt16BE(value,offset?);
    slice(val1,val2);
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

