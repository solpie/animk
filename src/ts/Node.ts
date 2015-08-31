declare var require:{
    (val:string):any;
};
var fs = require('fs');
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

