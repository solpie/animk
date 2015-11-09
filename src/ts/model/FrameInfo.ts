/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="ImageInfo.ts"/>
enum  PressFlag{
    L = 1,
    R = 2
}
class FrameData {
    start:number;
    hold:number;
    filename:number;

    static clone(val:FrameData) {
        var fd = new FrameData();
        for (var p in val) {
            fd[p] = val[p];
        }
        return fd;
    }
}
class FrameInfo extends EventDispatcher {
    _idx = -1;
    _start:number = 1;
    _end = 1;
    _hold = 1;
    id$:string;
    imageInfo:ImageInfo;
    pressFlag = 0;

    constructor(filename) {
        super();
        this.imageInfo = new ImageInfo(filename);
    }

    //idx in array
    getIdx() {
        return this._idx;
    }

    dtIdx(deltaVal) {
        this.setIdx(this._idx + deltaVal);
    }

    setIdx(v) {
        this._idx = v;
    }

    getStart() {
        return this._start;
    }

    dtStart(deltaVal) {
        this.setStart(this._start + deltaVal);
    }

    setStart(v) {
        this._start = v;
        this._end = v + this._hold - 1;
    }

    getHold() {
        return this._hold;
    }

    dtHold(deltaVal) {
        this.setHold(this._hold + deltaVal);
    }

    setHold(v) {
        this._hold = v;
        this._end = this._start + this._hold - 1;
    }

    getEnd() {
        return this._end;
    }

    getNameAndCount() {
        //image001.png

        var a = this.imageInfo.basename.split('.');
        //var a = "scn3#001.png".split('.');
        var name = a[0]; //image001
        var ext = '.'+a[1];//.png

        var re = /[0-9]+/g;
        //var ret = re.exec(name);
        var ret = name.match(re);


        //console.log(this,"ret",ret);
        //for (var i = 0; i < ret.length; i++) {
        //    var obj = ret[i];
        //    console.log(this,obj);
        //}
        var num = ret[ret.length - 1];
        var numPad = num.length;
        var basename = name.replace(num, "");
        return [basename, numPad,ext]
    }
}