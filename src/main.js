function chooseFile(name) {
    var chooser = $(name);
    chooser.unbind('change');
    //chooser.change(function (evt) {
    //});
    chooser.trigger('click');
    return chooser;
}
var EventDispatcher = (function () {
    function EventDispatcher() {
        this._func = {};
        this._funcId = 0;
    }
    EventDispatcher.prototype.add = function (type, func) {
        if (!this._func[type])
            this._func[type] = [];
        this._funcId++;
        this._func[type].push({ func: func, id: this._funcId });
    };
    EventDispatcher.prototype.dis = function (type, param) {
        if (this._func[type])
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f)
                    f.func(param);
            }
    };
    EventDispatcher.prototype.del = function (type, funcId) {
        if (this._func[type])
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f) {
                    if (f.id == funcId) {
                        delete this._func[type][i];
                        console.log('del event', type, funcId);
                        break;
                    }
                }
            }
    };
    return EventDispatcher;
})();
var fs = require('fs');
function readFile(file, options, callback) {
    if (callback == null) {
        callback = options;
        options = {};
    }
    fs.readFile(file, options, function (err, data) {
        if (err)
            return callback(err);
        var obj;
        try {
            obj = JSON.parse(data, options ? options.reviver : null);
        }
        catch (err2) {
            return callback(err2);
        }
        callback(null, obj);
    });
}
function readFileSync(file, options) {
    options = options || {};
    if (typeof options === 'string') {
        options = { encoding: options };
    }
    var shouldThrow = 'throws' in options ? options.throw : true;
    if (shouldThrow) {
        return JSON.parse(fs.readFileSync(file, options), options.reviver);
    }
    else {
        try {
            return JSON.parse(fs.readFileSync(file, options), options.reviver);
        }
        catch (err) {
            return null;
        }
    }
}
function writeFile(file, obj, options, callback) {
    if (callback == null) {
        callback = options;
        options = {};
    }
    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
            ? options.spaces : this.spaces
        : this.spaces;
    var str = '';
    try {
        str = JSON.stringify(obj, options ? options.replacer : null, spaces) + '\n';
    }
    catch (err) {
        if (callback)
            return callback(err, null);
    }
    fs.writeFile(file, str, options, callback);
}
function writeFileSync(file, obj, options) {
    options = options || {};
    var spaces = typeof options === 'object' && options !== null
        ? 'spaces' in options
            ? options.spaces : this.spaces
        : this.spaces;
    var str = JSON.stringify(obj, options.replacer, spaces) + '\n';
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options);
}
var jsonfile = {
    spaces: null,
    readFile: readFile,
    readFileSync: readFileSync,
    writeFile: writeFile,
    writeFileSync: writeFileSync
};
//module.exports = jsonfile; 
/// <reference path="EventDispatcher.ts"/>
var BaseEvent = (function () {
    function BaseEvent() {
    }
    return BaseEvent;
})();
var MouseEvt = (function () {
    function MouseEvt() {
    }
    MouseEvt.CLICK = "click"; //build-in name
    MouseEvt.DBLCLICK = "dblclick"; //build-in name
    MouseEvt.UP = "mouseup"; //build-in name
    MouseEvt.DOWN = "mousedown"; //build-in name
    MouseEvt.LEAVE = "mouseleave"; //build-in name
    return MouseEvt;
})();
var KeyEvt = (function () {
    function KeyEvt() {
    }
    KeyEvt.DOWN = "keydown"; //build-in name
    return KeyEvt;
})();
var ViewEvent = (function () {
    function ViewEvent() {
    }
    ViewEvent.CHANGED = "change"; //build-in name
    ViewEvent.RESIZE = "resize";
    ViewEvent.SCROLL = "scroll";
    return ViewEvent;
})();
///   model  events
var ProjectInfoEvent = (function () {
    function ProjectInfoEvent() {
    }
    ProjectInfoEvent.NEW_PROJ = "NEW_PROJ";
    return ProjectInfoEvent;
})();
var CompInfoEvent = (function () {
    function CompInfoEvent() {
    }
    CompInfoEvent.NEW_COMP = "new comp";
    CompInfoEvent.NEW_TRACK = "new track";
    CompInfoEvent.DEL_TRACK = "delete track";
    CompInfoEvent.UPDATE_CURSOR = "UPDATE_Cursor";
    return CompInfoEvent;
})();
var TrackInfoEvent = (function () {
    function TrackInfoEvent() {
    }
    TrackInfoEvent.LOADED = "load all imgs";
    TrackInfoEvent.SEL_TRACK = "select track";
    TrackInfoEvent.SEL_FRAME = "select frame";
    TrackInfoEvent.DEL_FRAME = "delete frame";
    TrackInfoEvent.SET_OPACITY = "set track opacity";
    TrackInfoEvent.SET_ENABLE = "set track enable";
    TrackInfoEvent.SET_NAME = "set track name";
    TrackInfoEvent.UPDATE_TRACK_START = "UPDATE_TRACK_START";
    return TrackInfoEvent;
})();
var FrameTimerEvent = (function () {
    function FrameTimerEvent() {
    }
    FrameTimerEvent.TICK = "TICK";
    return FrameTimerEvent;
})();
var TheMachineEvent = (function () {
    function TheMachineEvent() {
    }
    TheMachineEvent.UPDATE_IMG = "UPDATE_IMG";
    TheMachineEvent.ADD_IMG = "ADD_IMG";
    return TheMachineEvent;
})();
var TimelineId = "timeline";
var TimelineId$ = "#" + TimelineId;
var CompositionId$ = "#composition";
var VSplitterId$ = "#VSplitter0";
var ViewportId$ = "#Viewport0";
var VScrollBarId$ = "#VScrollBar0";
var TrackHeightId$ = "#trackHeight";
var HScrollBarId$ = "#HScrollBar0";
var TrackToolId$ = "#TrackTool0";
var TitleBarId$ = "#titleBar";
var ElmData = {
    Start: "dtStart"
};
var ElmId$ = {
    cursor: "#Cursor0",
    trackWidth: "#trackWidth",
    bottomBar: "#BottomBar0",
    cursorMask: "#cursorMask",
    btnNewTrack: "#btnNewTrack",
    btnDelTrack: "#btnDelTrack",
    btnUpdate: "#btnUpdate",
    timestampBar: "#TimestampBar0",
    compCanvas: "#Canvas0",
    hSplitter: "#HSplitter0",
    comp: "#Comp0",
    toolShelf: "#ToolShelf0",
    newTrackDialog: "#fileDialog",
    saveAsDialog: "#saveAsDialog",
    openFileDialog: "#openProjDialog",
    menuBtnFile: "#MenuBtnFile",
    titleBar$: "#titleBar",
    titleMenu: "#TitleMenu0",
    //file menu
    fileMenu: "#FileMenu0",
    fileMenuNew: "#FileMenuNew",
    fileMenuOpen: "#FileMenuOpen",
    fileMenuSave: "#FileMenuSave",
    fileMenuSaveAs: "#FileMenuSaveAs",
    //popup layer
    popupLayer: "#PopupLayer0",
    //
    btnCloseSetting: "#BtnCloseSetting0",
    settingWin: "#SettingWin0",
    tabButton0: "#TabButton0",
    tabPage0: "#TabPage0",
    tabButton1: "#TabButton1",
    tabPage1: "#TabPage1",
    tabButton2: "#TabButton2",
    tabPage2: "#TabPage2"
};
var ElmClass$ = {
    Track: ".Track",
    TrackCls: "Track",
    TrackArea: ".TrackArea",
    Clip: ".Clip",
    CheckBox: ".CheckBox",
    Slider: ".Slider",
    ActHint: ".ActHint",
    Frame: "Frame",
    VisibleCheckBox: ".VisibleCheckBox",
    Text: ".Text",
    Input: "input",
    FrameCanvas$: "FrameCanvas",
    Bar: ".Bar"
};
//back is top
var ZIdx = [ElmId$.cursor,
    ElmId$.cursorMask,
    VScrollBarId$,
    ElmId$.fileMenu,
    ElmId$.titleMenu,
    ElmId$.popupLayer
];
var ImageInfo = (function () {
    function ImageInfo(filename) {
        this.updateCount = 0;
        this.filename = filename;
        this.img = new Image();
    }
    ImageInfo.prototype.reloadImg = function () {
        if (this.filename) {
            this.updateCount++;
            this.img.src = this.filename + "?c=" + this.updateCount;
        }
    };
    return ImageInfo;
})();
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="ImageInfo.ts"/>
var PressFlag;
(function (PressFlag) {
    PressFlag[PressFlag["L"] = 1] = "L";
    PressFlag[PressFlag["R"] = 2] = "R";
})(PressFlag || (PressFlag = {}));
var FrameData = (function () {
    function FrameData() {
    }
    return FrameData;
})();
var FrameInfo = (function (_super) {
    __extends(FrameInfo, _super);
    function FrameInfo(filename) {
        _super.call(this);
        this._idx = -1;
        this._start = 1;
        this._end = 1;
        this._hold = 1;
        this.pressFlag = 0;
        this.imageInfo = new ImageInfo(filename);
    }
    //idx in array
    FrameInfo.prototype.getIdx = function () {
        return this._idx;
    };
    FrameInfo.prototype.dtIdx = function (deltaVal) {
        this.setIdx(this._idx + deltaVal);
    };
    FrameInfo.prototype.setIdx = function (v) {
        this._idx = v;
    };
    FrameInfo.prototype.getStart = function () {
        return this._start;
    };
    FrameInfo.prototype.dtStart = function (deltaVal) {
        this.setStart(this._start + deltaVal);
    };
    FrameInfo.prototype.setStart = function (v) {
        this._start = v;
        this._end = v + this._hold - 1;
    };
    FrameInfo.prototype.getHold = function () {
        return this._hold;
    };
    FrameInfo.prototype.dtHold = function (deltaVal) {
        this.setHold(this._hold + deltaVal);
    };
    FrameInfo.prototype.setHold = function (v) {
        this._hold = v;
        this._end = this._start + this._hold - 1;
    };
    FrameInfo.prototype.getEnd = function () {
        return this._end;
    };
    return FrameInfo;
})(EventDispatcher);
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../view/ViewId.ts"/>
/// <reference path="ImageInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
var TrackLoopType;
(function (TrackLoopType) {
    TrackLoopType[TrackLoopType["NONE"] = 0] = "NONE";
    TrackLoopType[TrackLoopType["HOLD"] = 1] = "HOLD";
    TrackLoopType[TrackLoopType["REPEAT"] = 2] = "REPEAT";
})(TrackLoopType || (TrackLoopType = {}));
var TrackType;
(function (TrackType) {
    TrackType[TrackType["IMAGE"] = 1] = "IMAGE";
    TrackType[TrackType["COMP"] = 2] = "COMP";
    TrackType[TrackType["AUDIO"] = 3] = "AUDIO";
})(TrackType || (TrackType = {}));
var TrackData = (function () {
    function TrackData() {
        this.enable = true;
        this.start = 1;
        this.end = 1;
    }
    return TrackData;
})();
var TrackInfo = (function (_super) {
    __extends(TrackInfo, _super);
    function TrackInfo(trackData) {
        _super.call(this);
        this.loopType = TrackLoopType.HOLD;
        this._start = 1;
        this._hold = 1;
        this._trackData = trackData;
        this.frameInfoArr = [];
        this.removedFrameArr = [];
    }
    TrackInfo.prototype.name = function (val) {
        if (isdef(val)) {
            this._trackData.name = val;
            this.dis(TrackInfoEvent.SET_NAME, val);
        }
        else
            return this._trackData.name;
    };
    TrackInfo.prototype.opacity = function (val) {
        if (isdef(val)) {
            this._trackData.opacity = val;
            this.dis(TrackInfoEvent.SET_OPACITY);
        }
        else
            return this._trackData.opacity;
    };
    TrackInfo.prototype.enable = function (val) {
        if (isdef(val)) {
            this._trackData.enable = val;
            this.dis(TrackInfoEvent.SET_ENABLE);
            appInfo.dis(TheMachineEvent.UPDATE_IMG);
        }
        else
            return this._trackData.enable;
    };
    TrackInfo.prototype.getPath = function () {
        return this._trackData.path;
    };
    TrackInfo.prototype.setStart = function (val) {
        this._start = val;
        this.dis(TrackInfoEvent.UPDATE_TRACK_START, this);
    };
    TrackInfo.prototype.getStart = function () {
        return this._start;
    };
    TrackInfo.prototype.newImage = function (frameDataArr) {
        var _this = this;
        var newFrame;
        var frameData;
        this._loadCount = frameDataArr.length;
        var holdCount = frameDataArr.length;
        for (var i = 0; i < frameDataArr.length; i++) {
            frameData = frameDataArr[i];
            newFrame = new FrameInfo(frameData.filename);
            //todo delete img listener
            newFrame.imageInfo.img.addEventListener("load", function () {
                _this.onImgLoaded();
            });
            if (frameData.start) {
                newFrame.setStart(frameData.start);
                newFrame.setHold(frameData.hold);
                holdCount += (frameData.hold - 1);
            }
            else {
                newFrame.setStart(i + 1);
                newFrame.setHold(1);
            }
            newFrame.setIdx(this.frameInfoArr.length);
            this.frameInfoArr.push(newFrame);
        }
        this._hold = holdCount;
    };
    TrackInfo.prototype.onImgLoaded = function () {
        //console.log(this, "load test");
        //img.removeEventListener("load", this._onLoadFunc);
        this._loadCount--;
        if (this._loadCount > 0) {
        }
        else {
            this.dis(TrackInfoEvent.LOADED);
        }
    };
    TrackInfo.prototype.getCurImg = function (frameIdx) {
        frameIdx -= this._start - 1;
        for (var i = 0; i < this.frameInfoArr.length; i++) {
            var frameInfo = this.frameInfoArr[i];
            if (frameInfo.getStart() <= frameIdx && frameInfo.getEnd() >= frameIdx) {
                return frameInfo.imageInfo.img;
            }
        }
        if (frameIdx > frameInfo.getEnd() && this.loopType == TrackLoopType.HOLD) {
            return frameInfo.imageInfo.img;
        }
    };
    TrackInfo.prototype.getIdxArr = function () {
        var a = [];
        for (var i = 0; i < this.frameInfoArr.length; i++) {
            a.push(ElmClass$.TrackCls + this.idx + ElmClass$.Frame + (i + 1));
        }
        return a;
    };
    TrackInfo.prototype.getHold = function () {
        return this._hold;
    };
    TrackInfo.prototype.getEnd = function () {
        return this._start + this._hold - 1;
    };
    TrackInfo.prototype.getPickFrameInfo = function (mouseX) {
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        //var idxX = Math.ceil(mouseX / appInfo.projectInfo.curComp.frameWidth);
        var pickFrame;
        for (var i = 0; i < this.frameInfoArr.length; ++i) {
            pickFrame = this.frameInfoArr[i];
            var startX = (pickFrame.getStart() - 1) * frameWidth;
            var endX = (pickFrame.getEnd()) * frameWidth;
            if (pickFrame && startX <= mouseX
                && endX >= mouseX) {
                var frameX = mouseX - startX;
                if (frameX < (endX - startX) / 2) {
                    pickFrame.pressFlag = PressFlag.L;
                }
                else {
                    pickFrame.pressFlag = PressFlag.R;
                }
                return pickFrame;
            }
            else {
            }
        }
        //console.log(this, "?Frame");
    };
    TrackInfo.prototype.R2R = function (pickFrame) {
        pickFrame.setHold(pickFrame.getHold() + 1);
        console.log(this, "R2R pick idx:", pickFrame.getIdx(), "hold:", pickFrame.getHold());
        var nextFrame;
        for (var i = pickFrame.getIdx() + 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            nextFrame.setStart(nextFrame.getStart() + 1);
            console.log(this, "R2R idx:", nextFrame.getIdx(), "start:", nextFrame.getStart());
        }
        this._hold++;
        //this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
    };
    TrackInfo.prototype.R2L = function (pickFrame) {
        pickFrame.setHold(pickFrame.getHold() - 1);
        var nextFrame;
        for (var i = pickFrame.getIdx() + 1; i < this.frameInfoArr.length; ++i) {
            nextFrame = this.frameInfoArr[i];
            nextFrame.setStart(nextFrame.getStart() - 1);
        }
        this._hold--;
        //this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
    };
    TrackInfo.prototype.L2L = function (pickFrame) {
        if (pickFrame.getIdx() > 0) {
            var preFrame = this.frameInfoArr[pickFrame.getIdx() - 1];
            var preHold = preFrame.getHold();
            if (preHold > 1) {
                preFrame.setHold(preFrame.getHold() - 1);
            }
            else
                this.removeFrame(preFrame);
        }
        pickFrame.setStart(pickFrame.getStart() - 1);
        pickFrame.setHold(pickFrame.getHold() + 1);
    };
    TrackInfo.prototype.clearRemoveFrame = function () {
        this.removedFrameArr.length = 0;
    };
    TrackInfo.prototype.L2R = function (pickFrame) {
        //fixme
        if (this.removedFrameArr.length) {
            var delFrame = this.removedFrameArr.pop();
            //this.frameInfoArr
            for (var i = delFrame.getIdx(); i < this.frameInfoArr.length; i++) {
                var frameInfo = this.frameInfoArr[i];
                frameInfo.dtIdx(1);
            }
            this.frameInfoArr.splice(delFrame.getIdx(), 0, delFrame);
        }
        else {
            if (pickFrame.getIdx() > 0) {
                this.frameInfoArr[pickFrame.getIdx() - 1].dtHold(1);
            }
        }
        if (pickFrame.getHold() > 1) {
            pickFrame.dtStart(1);
            pickFrame.dtHold(-1);
        }
        else {
            this.removeFrame(pickFrame);
        }
        //this.dis(TrackInfoEvent.UPDATE_HOLD, pickFrame);
        //    updateContentEndFrame();
        //    dumpTrackFrameIdx(trackInfo);
    };
    TrackInfo.prototype.removeFrame = function (frame) {
        console.log(this, "removeFrame idx", frame.getIdx(), 'len:', this.frameInfoArr.length);
        var removeIdx = frame.getIdx();
        this.removedFrameArr.push(frame);
        this.frameInfoArr.splice(removeIdx, 1);
        console.log(this, "removeFrame length", this.frameInfoArr.length);
        for (var i = removeIdx; i < this.frameInfoArr.length; i++) {
            var frameBack = this.frameInfoArr[i];
            frameBack.dtIdx(-1);
        }
        this.dis(TrackInfoEvent.DEL_FRAME, frame);
    };
    return TrackInfo;
})(EventDispatcher);
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
var FrameTimer = (function (_super) {
    __extends(FrameTimer, _super);
    function FrameTimer(framerate) {
        _super.call(this);
        this._isBusy = false;
        this._timerId = -1;
        this.setFramerate(framerate);
    }
    FrameTimer.prototype.start = function () {
        if (!this._isBusy)
            this.newTimer();
        this._isBusy = true;
    };
    FrameTimer.prototype.stop = function () {
        this._isBusy = false;
        //todo necessary
        this.clearTimer();
    };
    FrameTimer.prototype.isBusy = function () {
        return this._isBusy;
    };
    FrameTimer.prototype.setFramerate = function (framerate) {
        if (this._framerate != framerate) {
            this._framerate = framerate;
            this.clearTimer();
            this.newTimer();
        }
    };
    FrameTimer.prototype.clearTimer = function () {
        if (this._timerId > -1) {
            clearInterval(this._timerId);
        }
        this._timerId = -1;
    };
    FrameTimer.prototype.newTimer = function () {
        var _this = this;
        this._timerId = setInterval(function () {
            _this.onTick();
        }, 1000 / this._framerate);
    };
    FrameTimer.prototype.onTick = function () {
        if (this._isBusy) {
            this.dis(FrameTimerEvent.TICK);
        }
        else {
            this.clearTimer();
        }
    };
    return FrameTimer;
})(EventDispatcher);
var fs = require('fs');
var Stream = require('stream');
var zlib = require('zlib');
//var data = fs.read('c:/test.xml');
function walk(path) {
    var fileArr = [];
    var dirArr = fs.readdirSync(path);
    dirArr.forEach(function (item) {
        if (fs.statSync(path + '/' + item).isDirectory()) {
        }
        else {
            var filename = path + '/' + item;
            fileArr.push({ filename: filename });
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
    return val != undefined;
};
var ColorTheme = {
    TITLE_BAR_BOTTOM: "#FAF014"
};
var SizeTheme = {
    TrackPanelWidth: 200
};
/// <reference path="../Model/appInfo.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../Node.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="Theme.ts"/>
/// <reference path="ViewId.ts"/>
var BaseView = (function (_super) {
    __extends(BaseView, _super);
    function BaseView(id$) {
        _super.call(this);
        this.id$ = id$;
    }
    BaseView.prototype.setElement = function (val) {
        this.el = $(val);
    };
    BaseView.prototype.render = function () {
        return undefined;
    };
    BaseView.prototype.setParent = function (parent) {
        parent.append(this.render());
    };
    BaseView.prototype.height = function () {
        return $(this.id$).height();
    };
    BaseView.prototype.width = function () {
        return $(this.id$).width();
    };
    BaseView.prototype.setColor = function (val) {
        $(this.id$).css({ background: val });
    };
    return BaseView;
})(EventDispatcher);
/// <reference path="BaseView.ts"/>
/// <reference path="../model/FrameInfo.ts"/>
var FrameView = (function (_super) {
    __extends(FrameView, _super);
    function FrameView(frameCanvasId) {
        _super.call(this);
        this.barHeight = 15;
        this.canvasEl = document.getElementById(frameCanvasId);
        this.ctx = this.canvasEl.getContext("2d");
    }
    FrameView.prototype.resize = function (w, h) {
        if (w != -1)
            this._width = w;
        if (h != -1)
            this._height = h;
        this.canvasEl.setAttribute("width", this._width + "");
        this.canvasEl.setAttribute("height", this._height + "");
    };
    FrameView.prototype.updateFrame = function (frameInfoArr, changeCount) {
        var frameWidth = appInfo.frameWidth();
        if (changeCount)
            this.resize(this._width + changeCount * frameWidth, this._height);
        console.log(this, "updateFrame");
        for (var i = 0; i < frameInfoArr.length; i++) {
            var frameInfo = frameInfoArr[i];
            var img = frameInfo.imageInfo.img;
            if (img) {
                var frameX = (frameInfo.getStart() - 1) * frameWidth;
                var holdWidth = frameWidth * frameInfo.getHold();
                console.log(this, "Frame idx", frameInfo.getIdx(), "hold", frameInfo.getHold(), img.src);
                this.ctx.clearRect(frameX, this.barHeight, holdWidth, frameWidth);
                var thumbWidth = frameWidth - 1;
                var thumbHeight = thumbWidth / img.width * img.height;
                this.ctx.fillStyle = "#fff";
                this.ctx.fillRect(frameX + 1, this.barHeight, thumbWidth, thumbWidth);
                var thumbY = (thumbWidth - thumbHeight) * .5;
                this.ctx.drawImage(img, frameX + 1, thumbY + this.barHeight, thumbWidth, thumbHeight);
                if (frameInfo.getHold() > 1) {
                    this.ctx.font = '14px serif';
                    this.ctx.fillStyle = '#FFF';
                    this.ctx.textAlign = "right";
                    this.ctx.fillText(frameInfo.getHold(), frameX + holdWidth - 10, 15 + this.barHeight);
                }
                ///////draw bar
                this.fillRect("#2f2f2f", frameX, 0, holdWidth, this.barHeight);
                /////// draw idx
                this.ctx.globalAlpha = 1;
                this.ctx.font = '10px serif';
                this.ctx.fillStyle = '#FFF';
                this.ctx.textAlign = "center";
                this.ctx.fillText(frameInfo.getIdx() + 1, frameX + frameWidth * .5, 10);
            }
            else {
                console.log(this, "can not comp trk ", i);
            }
        }
    };
    FrameView.prototype.fillRect = function (col, x, y, w, h, a) {
        if (a)
            this.ctx.globalAlpha = a;
        this.ctx.fillStyle = col;
        this.ctx.fillRect(x, y, w, h);
    };
    return FrameView;
})(BaseView);
/// <reference path="../event/EventDispatcher.ts"/>
var BaseWidget = (function (_super) {
    __extends(BaseWidget, _super);
    function BaseWidget(id$) {
        _super.call(this);
        if (id$)
            this.id$ = id$;
    }
    return BaseWidget;
})(EventDispatcher);
/// <reference path="BaseWidget.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../event/ActEvent.ts"/>
var Slider = (function (_super) {
    __extends(Slider, _super);
    function Slider(id$) {
        var _this = this;
        _super.call(this, id$);
        this._timerId = 0;
        this._minVal = 0;
        this._maxVal = 1;
        this._rangeVal = 1;
        $(id$).on(MouseEvt.DOWN, function () {
            _this.onDown();
        });
        appInfo.add(MouseEvt.UP, function () {
            _this.onUp();
        });
        this._width = $(this.id$).width();
    }
    Slider.prototype.startMoveTimer = function () {
        var _this = this;
        this._timerId = setInterval(function () {
            var barWidth = appInfo.mouseX - $(_this.id$).position().left;
            if (barWidth > _this._width)
                barWidth = _this._width;
            if (barWidth < 0)
                barWidth = 0;
            _this._value = barWidth / _this._width * _this._rangeVal;
            //change view
            //$(this.id$ + " " + ".Bar").width(barWidth);
            //$(this.id$ + " " + ".Label").html(parseInt(this._value * 100) + "%");
            _this.dis(ViewEvent.CHANGED, _this._value);
        }, 20);
    };
    Slider.prototype.stopMoveTimer = function () {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = 0;
        }
    };
    Slider.prototype.onUp = function () {
        if (this._isPress) {
            this._isPress = false;
            this.stopMoveTimer();
            $(this.id$ + " " + ".Label").css({ display: "none" });
        }
    };
    Slider.prototype.setBarWidth = function (val) {
        $(this.id$ + " " + ".Bar").width(this._width * val);
        $(this.id$ + " " + ".Label").html(Math.floor(this._value * 100) + "%");
    };
    Slider.prototype.setRange = function (min, max) {
        this._maxVal = max;
        this._minVal = min;
        this._rangeVal = max - min;
    };
    Slider.prototype.onDown = function () {
        this._isPress = true;
        $(this.id$ + " " + ".Label").css({ display: "block" });
        this.dis(ViewEvent.CHANGED, this._value);
        this.startMoveTimer();
    };
    return Slider;
})(BaseWidget);
/// <reference path="BaseView.ts"/>
/// <reference path="FrameView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
/// <reference path="../model/AppInfo.ts"/>
/// <reference path="../widget/Slider.ts"/>
var TrackView = (function (_super) {
    __extends(TrackView, _super);
    function TrackView(trackInfo) {
        _super.call(this);
        this._pickFrame = null;
        this.trackInfo = trackInfo;
    }
    TrackView.prototype.render = function () {
        var template = $('.Track-tpl').html();
        return Mustache.render(template, {
            idx: this.trackInfo.idx,
            name: this.trackInfo.name(),
            frameIdxArr: this.trackInfo.getIdxArr()
        });
    };
    TrackView.prototype.setActFrame = function (frameIdx) {
        console.log(this, "SEL_FRAME", frameIdx, this.id$);
        var actHint = $(this.id$ + " " + ElmClass$.ActHint);
        if (frameIdx) {
            var frameInfo = this.trackInfo.frameInfoArr[frameIdx];
            //actHint.css({top: 65});
            if (frameInfo) {
                actHint.css({ left: (frameInfo.getStart() - 1) * appInfo.frameWidth() });
                actHint.css({ display: "block" });
                appInfo.tm.actImg = frameInfo.imageInfo.filename;
                appInfo.tm.ActFrameInfo = frameInfo;
            }
        }
        else {
            actHint.css({ display: "none" });
        }
    };
    //use for add Child view to parent
    TrackView.prototype.setParent = function (parent) {
        var _this = this;
        _super.prototype.setParent.call(this, parent);
        var idx = this.trackInfo.idx;
        this.id$ = ElmClass$.Track + "#" + idx;
        ///  trackInfo event
        //////// opacity slider
        this.trackInfo.add(TrackInfoEvent.SET_OPACITY, function () {
            _this.onSetOpacity();
        });
        this._slider = new Slider(this.id$ + " " + ElmClass$.Slider);
        this._slider.add(ViewEvent.CHANGED, function (val) {
            _this.onSlider(val);
        });
        //////// visible checkbox
        this.trackInfo.add(TrackInfoEvent.SET_ENABLE, function () {
            _this.onVisible();
        });
        $(this.id$ + " " + ElmClass$.CheckBox).on(MouseEvt.DOWN, function () {
            _this.trackInfo.enable(!_this.trackInfo.enable());
        });
        ////////////////     track name input
        var trackName$ = $(this.id$ + " " + ElmClass$.Text);
        var trackInput$ = $(this.id$ + " " + ElmClass$.Input);
        this.trackInfo.add(TrackInfoEvent.SET_NAME, function (name) {
            trackName$.html(name);
        });
        trackInput$.on(ViewEvent.CHANGED, function () {
            var newName = trackInput$.val();
            _this.trackInfo.name(newName);
        });
        trackName$.on(MouseEvt.DBLCLICK, function () {
            trackInput$.val(_this.trackInfo.name());
            trackInput$.css({ display: "block" });
            trackInput$.focus();
            trackInput$.on(KeyEvt.DOWN, function (e) {
                if (Keys.Char(e.keyCode, "\r")) {
                    trackInput$.css({ display: "none" });
                    trackInput$.unbind(KeyEvt.DOWN);
                }
            });
        });
        //////////////////////////////////////////////
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clipWidth = this.trackInfo.getHold() * frameWidth;
        this.el = $(this.id$)[0];
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        this.updateClip();
        clip.on(MouseEvt.DOWN, function (e) {
            _this.onMouseDown(e);
        });
        appInfo.add(MouseEvt.UP, function () {
            _this.onUp();
        });
        this.setColor('#444');
        console.log(this, "setParent", clip, clipWidth);
        //todo MouseDown is duplicate
        $(this.id$).on(MouseEvt.DOWN, function () {
            if (_this.trackInfo.isSelected && !_this._isPressWidget)
                _this.setSelected(false);
            else
                _this.trackInfo.dis(TrackInfoEvent.SEL_TRACK, _this.trackInfo);
        });
        this.initFrame();
    };
    TrackView.prototype.onVisible = function () {
        if (this.trackInfo.enable())
            $(this.id$ + " " + ElmClass$.VisibleCheckBox).css({ background: "#FAF014" });
        else
            $(this.id$ + " " + ElmClass$.VisibleCheckBox).css({ background: "#333" });
        this._isPressWidget = true;
    };
    TrackView.prototype.onSlider = function (val) {
        this.trackInfo.opacity(val);
        this._isPressWidget = true;
    };
    TrackView.prototype.onMouseDown = function (e) {
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        var barHeight = $(this.id$ + " " + ElmClass$.Bar).height();
        this._lastX = appInfo.mouseX;
        var mouseY = e.clientY - $(this.id$).offset().top;
        this._isPressWidget = true;
        if (mouseY < barHeight) {
            this._isPressBar = true;
        }
        else if (!this._pickFrame) {
            var mouseX = e.clientX - clip.offset().left;
            var frameInfo = this.trackInfo.getPickFrameInfo(mouseX);
            this._pickFrame = frameInfo;
            if (this._pickFrame)
                console.log("Pick frame", mouseX, frameInfo, frameInfo.getIdx(), "Left", frameInfo.pressFlag);
        }
        this.startMoveTimer();
    };
    TrackView.prototype.initFrame = function () {
        var _this = this;
        var frameWidth = appInfo.frameWidth();
        this.trackInfo.add(TrackInfoEvent.LOADED, function () {
            //this.trackInfo.getHold();
            _this._frameView.resize(_this.trackInfo.getHold() * frameWidth, -1);
            _this._frameView.updateFrame(_this.trackInfo.frameInfoArr);
            appInfo.dis(TheMachineEvent.UPDATE_IMG);
        });
        this.trackInfo.add(TrackInfoEvent.DEL_FRAME, function (delFrame) {
            _this.onDelFrame(delFrame);
        });
        this._frameView = new FrameView(ElmClass$.FrameCanvas$ + this.trackInfo.idx + "");
        this._frameView.resize(frameWidth * this.trackInfo.frameInfoArr.length, frameWidth + 15);
        for (var i = 0; i < this.trackInfo.frameInfoArr.length; i++) {
            var frameInfo = this.trackInfo.frameInfoArr[i];
            frameInfo.imageInfo.reloadImg();
        }
    };
    TrackView.prototype.onSetOpacity = function () {
        this._slider.setBarWidth(this.trackInfo.opacity());
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    };
    TrackView.prototype.updateClip = function () {
        var frameWidth = appInfo.projectInfo.curComp.frameWidth;
        var clip = $(this.id$ + " " + ElmClass$.Clip);
        clip.css({ left: this.trackInfo.getStart() * frameWidth - appInfo.projectInfo.curComp.hScrollVal });
        //clip.width((this.trackInfo.getHold()) * frameWidth);
    };
    TrackView.prototype.onDelFrame = function (delFrame) {
        $(this.getFrameId$(delFrame.getIdx())).remove();
        var isEnd = false;
        var idx = delFrame.getIdx();
        while (!isEnd) {
            var frame$ = $(this.getFrameId$(idx));
            if (frame$) {
                console.log(this, "delFrame", frame$.attr("id"));
                frame$.attr("id", this.getFrameId$(idx - 1));
                console.log(this, "delFrame", frame$.attr("id"));
                idx++;
                if (idx == 10)
                    isEnd = true;
            }
            else
                isEnd = true;
        }
        this.updateClip();
    };
    TrackView.prototype.getFrameId$ = function (idx) {
        return "#" + ElmClass$.TrackCls + this.trackInfo.idx + ElmClass$.Frame + (idx + 1);
    };
    TrackView.prototype.onUp = function () {
        this._isPressBar = false;
        this._isPressWidget = false;
        if (this._pickFrame) {
            this.trackInfo.dis(TrackInfoEvent.SEL_FRAME, [this.trackInfo.idx, this._pickFrame.getIdx()]);
            this._pickFrame.pressFlag = 0;
        }
        this._pickFrame = null;
        this.trackInfo.clearRemoveFrame();
        this.stopMoveTimer();
    };
    TrackView.prototype.setSelected = function (val) {
        this.trackInfo.isSelected = val;
        if (val)
            this.setColor("#666");
        else
            this.setColor("#444");
    };
    TrackView.prototype.onPickFrame = function (isMoveToRight) {
        if (isMoveToRight) {
            if (this._pickFrame.pressFlag == PressFlag.R) {
                this.trackInfo.R2R(this._pickFrame);
                this._frameView.updateFrame(this.trackInfo.frameInfoArr, 1);
            }
            else if (this._pickFrame.pressFlag == PressFlag.L) {
                this.trackInfo.L2R(this._pickFrame);
                this._frameView.updateFrame(this.trackInfo.frameInfoArr);
            }
        }
        else {
            if (this._pickFrame.pressFlag == PressFlag.R) {
                this.trackInfo.R2L(this._pickFrame);
                this._frameView.updateFrame(this.trackInfo.frameInfoArr, -1);
            }
            else if (this._pickFrame.pressFlag == PressFlag.L)
                this.trackInfo.L2L(this._pickFrame);
            this._frameView.updateFrame(this.trackInfo.frameInfoArr);
        }
    };
    TrackView.prototype.startMoveTimer = function () {
        var _this = this;
        this._timerId = window.setInterval(function () {
            var clip = $(_this.id$ + " " + ElmClass$.Clip);
            if (_this._isPressWidget) {
                var frameWidth = appInfo.projectInfo.curComp.frameWidth;
                var dx = appInfo.mouseX - _this._lastX;
                if (dx > frameWidth) {
                    _this._lastX = appInfo.mouseX;
                    if (_this._isPressBar) {
                        _this.trackInfo.setStart(_this.trackInfo.getStart() + 1);
                        clip.css({ left: clip.position().left + frameWidth });
                    }
                    else if (_this._pickFrame) {
                        _this.onPickFrame(true);
                    }
                }
                else if (dx < -frameWidth) {
                    _this._lastX = appInfo.mouseX;
                    if (_this._isPressBar) {
                        _this.trackInfo.setStart(_this.trackInfo.getStart() - 1);
                        clip.css({ left: clip.position().left - frameWidth });
                    }
                    else if (_this._pickFrame) {
                        _this.onPickFrame(false);
                    }
                }
            }
            //console.log(this, "startMoveTimer", self._timerId);
        }, 20);
    };
    TrackView.prototype.stopMoveTimer = function () {
        if (this._timerId) {
            window.clearInterval(this._timerId);
            //console.log(this, "stopMoveTimer", this._timerId);
            this._timerId = 0;
        }
    };
    TrackView.prototype.onDelTrack = function () {
        appInfo.projectInfo.curComp.delTrack(this.trackInfo.idx);
    };
    TrackView.prototype.remove = function () {
        console.log(this, "remove track idx:", this.trackInfo.idx);
        $(this.el).remove();
    };
    TrackView.prototype.hScrollTo = function (val) {
        $(this.id$ + " " + ElmClass$.TrackArea).scrollLeft(val);
    };
    return TrackView;
})(BaseView);
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="TrackInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
/// <reference path="FrameTimer.ts"/>
/// <reference path="../view/TrackView.ts"/>
/// <reference path="../Node.ts"/>
var CompositionData = (function () {
    function CompositionData() {
    }
    return CompositionData;
})();
var CompositionInfo = (function (_super) {
    __extends(CompositionInfo, _super);
    function CompositionInfo(width, height, framerate) {
        var _this = this;
        _super.call(this);
        this.framerate = 24;
        this.frameWidth = 40;
        this.hScrollVal = 0;
        this._cursorPos = 1;
        this.isInit = false;
        this.width = width;
        this.height = height;
        this.framerate = framerate;
        this.trackInfoArr = [];
        this._frameTimer = new FrameTimer(framerate);
        this._frameTimer.add(FrameTimerEvent.TICK, function () {
            _this.onFrameTimerTick();
        });
    }
    CompositionInfo.prototype.onFrameTimerTick = function () {
        this.forward();
    };
    CompositionInfo.prototype.play = function () {
        this._stayBack = this._cursorPos;
        this._frameTimer.start();
    };
    CompositionInfo.prototype.pause = function () {
        this._frameTimer.stop();
    };
    CompositionInfo.prototype.toggle = function () {
        if (this._frameTimer.isBusy())
            this.pause();
        else
            this.play();
    };
    CompositionInfo.prototype.stayBack = function () {
        if (this._stayBack > 0) {
            this.pause();
            this.setCursor(this._stayBack);
            this._stayBack = 0;
        }
        else if (this._stayBack == 0) {
            this.setCursor(1);
            this._stayBack = -1;
        }
    };
    CompositionInfo.prototype.setCursor = function (framePos) {
        this._cursorPos = framePos;
        this.dis(CompInfoEvent.UPDATE_CURSOR, this._cursorPos);
    };
    CompositionInfo.prototype.forward = function () {
        if (this._cursorPos >= this._maxPos)
            this.setCursor(1);
        else
            this.setCursor(this._cursorPos + 1);
    };
    CompositionInfo.prototype.backward = function () {
        if (this._cursorPos > 1) {
            this.setCursor(this._cursorPos - 1);
        }
    };
    CompositionInfo.prototype.getCursor = function () {
        return this._cursorPos;
    };
    CompositionInfo.prototype.walk = function (path) {
        var fileArr = [];
        var dirArr = fs.readdirSync(path);
        dirArr.forEach(function (item) {
            if (fs.statSync(path + '/' + item).isDirectory()) {
            }
            else {
                var filename = path + '/' + item;
                fileArr.push({ filename: filename });
                console.log("file:", filename);
            }
        });
        return fileArr;
    };
    CompositionInfo.prototype.newTrack = function (path) {
        var trackData = new TrackData();
        trackData.frames = this.walk(path);
        trackData.name = 'track#' + this.trackInfoArr.length;
        trackData.path = path;
        trackData.start = 1;
        this.newTrackByTrackData(trackData);
    };
    CompositionInfo.prototype.newTrackByTrackData = function (trackData) {
        var trackInfo = new TrackInfo(trackData);
        trackInfo.newImage(trackData.frames);
        trackInfo.path = trackData.path;
        trackInfo.setStart(trackData.start);
        trackInfo.idx = this.trackInfoArr.length;
        this.trackInfoArr.push(trackInfo);
        this.dis(CompInfoEvent.NEW_TRACK, trackInfo);
    };
    CompositionInfo.prototype.delSelTrack = function () {
        var trackInfo;
        for (var i in this.trackInfoArr) {
            trackInfo = this.trackInfoArr[i];
            if (trackInfo && trackInfo.isSelected) {
                this.delTrack(trackInfo.idx);
                break;
            }
        }
    };
    CompositionInfo.prototype.delTrack = function (idx) {
        //this.trackInfoArr.splice(idx, 1);
        delete this.trackInfoArr[idx];
        console.log(this, "delTrack", idx + '');
        this.getMaxSize();
        this.dis(CompInfoEvent.DEL_TRACK, idx);
        //this.trackViewArr.splice(idx, 1);
    };
    CompositionInfo.prototype.getMaxSize = function () {
        var maxFrame = 0;
        var trackEnd;
        for (var i = 0; i < this.trackInfoArr.length; i++) {
            var trackInfo = this.trackInfoArr[i];
            if (trackInfo) {
                trackEnd = trackInfo.getEnd();
                if (maxFrame < trackEnd)
                    maxFrame = trackEnd;
            }
        }
        this._maxPos = maxFrame;
        return maxFrame;
    };
    return CompositionInfo;
})(EventDispatcher);
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../util/JSONFile.ts"/>
/// <reference path="CompositionInfo.ts"/>
var ProjectInfo = (function (_super) {
    __extends(ProjectInfo, _super);
    function ProjectInfo(options) {
        _super.call(this);
        this.comps = [];
        this.version = '0.1.0';
    }
    ProjectInfo.prototype.newComp = function (width, height, framerate) {
        var compInfo = new CompositionInfo(width, height, framerate);
        this.curComp = compInfo;
        this.comps.push(compInfo);
        compInfo.name = "Comp" + this.comps.length;
        console.log(this, "new CompInfo");
        this.dis(CompInfoEvent.NEW_COMP, compInfo);
        return compInfo;
    };
    /////////////////////// open project
    ProjectInfo.prototype.open = function (path) {
        var _this = this;
        console.log(this, "open project", path);
        jsonfile.readFile(path, null, function (err, projData) {
            console.log(_this, "open project ver:", projData.linAnil.version);
            _this.version = projData.linAnil.version;
            for (var i = 0; i < projData.linAnil.composition.length; i++) {
                var compData = projData.linAnil.composition[i];
                var compInfo = _this.newComp(compData.width, compData.height, compData.framerate);
                for (var j = 0; j < compData.tracks.length; j++) {
                    var trackData = compData.tracks[j];
                    var path = trackData.path;
                    for (var k = 0; k < trackData.frames.length; k++) {
                        var frameData = trackData.frames[k];
                        frameData.filename = M_path.join(path, frameData.filename);
                    }
                    compInfo.newTrackByTrackData(trackData);
                }
            }
        });
    };
    ProjectInfo.prototype.save = function (path) {
        this.saveFilename = path;
        var projData = {
            linAnil: {
                version: this.version,
                setting: {},
                composition: []
            }
        };
        for (var i = 0; i < this.comps.length; i++) {
            var compInfo = this.comps[i];
            if (!compInfo)
                continue;
            var compData = {
                name: compInfo.name,
                framerate: compInfo.framerate,
                framewidth: compInfo.frameWidth,
                height: compInfo.height,
                width: compInfo.width,
                tracks: []
            };
            projData.linAnil.composition.push(compData);
            for (var j = 0; j < compInfo.trackInfoArr.length; j++) {
                var trackInfo = compInfo.trackInfoArr[j];
                if (!trackInfo)
                    continue;
                var trackData = {
                    name: trackInfo.name(),
                    opacity: trackInfo.opacity(),
                    enable: trackInfo.enable(),
                    start: trackInfo.getStart(),
                    loopType: trackInfo.loopType,
                    end: trackInfo.getEnd(),
                    path: trackInfo.path,
                    frames: []
                };
                compData.tracks.push(trackData);
                for (var k = 0; k < trackInfo.frameInfoArr.length; k++) {
                    var frameInfo = trackInfo.frameInfoArr[k];
                    if (!frameInfo)
                        continue;
                    var frameData = {
                        start: frameInfo.getStart(),
                        hold: frameInfo.getHold(),
                        filename: M_path.basename(frameInfo.imageInfo.filename)
                    };
                    trackData.frames.push(frameData);
                }
            }
        }
        jsonfile.writeFile(path, projData, null, function (err) {
            //console.error(err)
        });
    };
    return ProjectInfo;
})(EventDispatcher);
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="AppInfo.ts"/>
/// <reference path="FrameInfo.ts"/>
/// <reference path="../JQuery.ts"/>
//the government has a secret system a machine,spies on you every hour of every day.
var exec = require('child_process').exec;
var TheMachine = (function (_super) {
    __extends(TheMachine, _super);
    function TheMachine() {
        _super.call(this);
        this._updateCount = 0; //for clear cache
        this.watchArr = [];
    }
    TheMachine.prototype.updateWatchArr = function () {
        this._updateCount++;
        for (var i = 0; i < this.watchArr.length; i++) {
            var frameInfo = this.watchArr[i];
            frameInfo.imageInfo.reloadImg();
            $(frameInfo.id$).attr("src", frameInfo.imageInfo.filename + "?fc=" + this._updateCount);
        }
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    };
    TheMachine.prototype.watchAct = function () {
        if (this.ActFrameInfo) {
            if (this.watchArr.indexOf(this.ActFrameInfo) > -1) {
                console.log(this, "watching");
            }
            else {
                this.watchArr.push(this.ActFrameInfo);
                this.dis(TheMachineEvent.ADD_IMG);
            }
            this.open(this.ActFrameInfo.imageInfo.filename);
        }
    };
    TheMachine.prototype.open = function (path) {
        path = path.replace("/", "\\");
        console.log(this, "open:", path);
        exec('"D:\\Program Files\\CELSYS\\CLIP STUDIO\\CLIP STUDIO PAINT\\CLIPStudioPaint.exe" ' + path, function (error, stdout, stderr) {
            if (stdout) {
                console.log('stdout: ' + stdout);
            }
            if (stderr) {
                console.log('stderr: ' + stderr);
            }
            if (error !== null) {
                console.log('Exec error: ' + error);
            }
        });
    };
    return TheMachine;
})(EventDispatcher);
var Filter = (function (_super) {
    __extends(Filter, _super);
    function Filter(width, height, depthInBytes, Bpp, data, options) {
        _super.call(this);
        this._width = width;
        this._height = height;
        this._depthInBytes = depthInBytes;
        //this._Bpp = Bpp;
        this._data = data;
        this._options = options;
        this._line = 0;
        if (!('filterType' in options) || options.filterType == -1) {
            options.filterType = [0, 1, 2, 3, 4];
        }
        else if (typeof options.filterType == 'number') {
            options.filterType = [options.filterType];
        }
        this._filters = {
            0: this._filterNone.bind(this)
        };
    }
    Filter.prototype.filter = function () {
        var pxData = this._data, rawData = new Buffer(((this._width << (2 + this._depthInBytes - 1)) + 1) * this._height);
        //rawData.fill(0);
        for (var y = 0; y < this._height; y++) {
            // find best filter for this line (with lowest sum of values)
            var filterTypes = this._options.filterType, min = Infinity, sel = 0;
            for (var i = 0; i < filterTypes.length; i++) {
                var sum = this._filters[filterTypes[i]](pxData, y, null);
                if (sum < min) {
                    sel = filterTypes[i];
                    min = sum;
                }
            }
            this._filters[sel](pxData, y, rawData);
        }
        return rawData;
    };
    Filter.prototype._filterNone = function (pxData, y, rawData) {
        var pxRowLength = this._width << (2 + this._depthInBytes - 1), rawRowLength = pxRowLength + 1, sum = 0;
        if (!rawData) {
            for (var x = 0; x < pxRowLength; x++)
                sum += Math.abs(pxData[y * pxRowLength + x]);
        }
        else {
            rawData[y * rawRowLength] = 0;
            pxData.copy(rawData, rawRowLength * y + 1, pxRowLength * y, pxRowLength * (y + 1));
        }
        return sum;
    };
    return Filter;
})(Stream);
/// <reference path="Filter.ts"/>
/// <reference path="../../Node.ts"/>
var Packer = (function (_super) {
    __extends(Packer, _super);
    function Packer(options) {
        _super.call(this);
        this.PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        this.TYPE_IHDR = 0x49484452;
        this.TYPE_IDAT = 0x49444154;
        this.TYPE_IEND = 0x49454e44;
        this._options = options;
        options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
        options.deflateLevel = options.deflateLevel || 9;
        options.deflateStrategy = options.deflateStrategy || 3;
        this.readable = true;
        this.initCrc();
    }
    Packer.prototype.initCrc = function () {
        this.crcTable = [];
        for (var i = 0; i < 256; i++) {
            var c = i;
            for (var j = 0; j < 8; j++) {
                if (c & 1) {
                    c = 0xedb88320 ^ (c >>> 1);
                }
                else {
                    c = c >>> 1;
                }
            }
            this.crcTable[i] = c;
        }
    };
    Packer.prototype.pack = function (pixelData, width, height, depthInBytes) {
        // Signature
        this.emit('data', new Buffer(this.PNG_SIGNATURE));
        this.emit('data', this._packIHDR(width, height, depthInBytes));
        // filter pixel data
        var filter = new Filter(width, height, depthInBytes, 4, pixelData, this._options); //UNDO : feed image depth
        var dataFilter = filter.filter();
        //console.log(this, "dataFilter len", dataFilter.length);
        // compress it
        var deflate = zlib.createDeflate({
            chunkSize: this._options.deflateChunkSize,
            level: this._options.deflateLevel,
            strategy: this._options.deflateStrategy
        });
        deflate.on('error', this.emit.bind(this, 'error'));
        deflate.on('data', function (data) {
            this.emit('data', this._packIDAT(data));
        }.bind(this));
        deflate.on('end', function () {
            this.emit('data', this._packIEND());
            this.emit('end');
        }.bind(this));
        deflate.end(dataFilter);
        //deflate.end(pixelData);
        return this;
    };
    Packer.prototype._packIHDR = function (width, height, depthInBytes) {
        var buf = new Buffer(13);
        buf.writeUInt32BE(width, 0);
        buf.writeUInt32BE(height, 4);
        buf[8] = depthInBytes * 8; //UNDO : original value : 8
        buf[9] = 6; // colorType
        buf[10] = 0; // compression
        buf[11] = 0; // filter
        buf[12] = 0; // interlace
        return this._packChunk(this.TYPE_IHDR, buf);
    };
    Packer.prototype._packIDAT = function (data) {
        return this._packChunk(this.TYPE_IDAT, data);
    };
    Packer.prototype._packIEND = function () {
        return this._packChunk(this.TYPE_IEND, null);
    };
    Packer.prototype._packChunk = function (type, data) {
        var len = (data ? data.length : 0), buf = new Buffer(len + 12);
        buf.writeUInt32BE(len, 0);
        buf.writeUInt32BE(type, 4);
        if (data)
            data.copy(buf, 8);
        buf.writeInt32BE(this.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
        return buf;
    };
    Packer.prototype.crc32 = function (buf) {
        var crc = -1;
        for (var i = 0; i < buf.length; i++) {
            crc = this.crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        return crc ^ -1;
    };
    return Packer;
})(Stream);
/// <reference path="Packer.ts"/>
var PngMaker = (function () {
    function PngMaker() {
    }
    PngMaker.prototype.createPng = function (w, h) {
        var packer = new Packer({
            width: w,
            depthInBytes: 1,
            filterType: 0,
            height: h
        });
        var pixeldata = new Buffer(w * h * 4);
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var idx = (w * y + x) << 2;
                pixeldata[idx] = 0; //red
                pixeldata[idx + 1] = 0; //green
                pixeldata[idx + 2] = 0; //blue
                // opacity
                pixeldata[idx + 3] = 0;
            }
        }
        var buffers = [];
        packer.on('data', function (buffer) {
            buffers.push(buffer);
            console.log(this, 'push buffer');
        });
        packer.on('end', function () {
            var buffer = Buffer.concat(buffers);
            var stream = fs.createWriteStream('../test/test.png');
            stream.write(buffer);
            stream.close();
        });
        //packer.on('error', dataStream.emit.bind(dataStream, 'error'));
        packer.pack(pixeldata, w, h, 1);
    };
    return PngMaker;
})();
/// <reference path="ProjectInfo.ts"/>
/// <reference path="TheMachine.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../util/png/PngMaker.ts"/>
var AppInfo = (function (_super) {
    __extends(AppInfo, _super);
    function AppInfo() {
        _super.call(this);
        this.tm = new TheMachine();
    }
    AppInfo.prototype.newProject = function () {
        this.projectInfo = new ProjectInfo();
        this.dis(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.newComp(1280, 720, 24);
        this.projectInfo.curComp.setCursor(1);
    };
    AppInfo.prototype.openProject = function (path) {
        this.projectInfo = new ProjectInfo();
        this.dis(ProjectInfoEvent.NEW_PROJ);
        this.projectInfo.open(path);
        //this.projectInfo.curComp.setCursor(1);
    };
    AppInfo.prototype.test = function (test) {
        var _this = this;
        $("#btnTest").on(MouseEvt.CLICK, function () {
            //this.projectInfo.curComp.newTrack('D:/projects/animk/test/test60');
            //console.log(this, "test");
            {
                _this.newProject();
                _this.projectInfo.newComp(1280, 720, 24).newTrack('D:/projects/animk/test/test30');
                _this.projectInfo.curComp.newTrack('D:/projects/animk/test/test10');
                _this.projectInfo.curComp.setCursor(1);
            }
        });
        var pnglib = new PngMaker();
        pnglib.createPng(300, 300);
        //this.projectInfo = new ProjectInfo();
        //this.dis(ProjectInfoEvent.NEW_PROJ);
        //this.projectInfo.open('../test/data.json');
        //this.projectInfo.save('D:/projects/animk/test/data.json')
        //function loadUser() {
        //}
    };
    AppInfo.prototype.frameWidth = function () {
        return this.projectInfo.curComp.frameWidth;
    };
    return AppInfo;
})(EventDispatcher);
var appInfo = new AppInfo();
/// <reference path="BaseView.ts"/>
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="TrackView.ts"/>
/// <reference path="../model/CompositionInfo.ts"/>
/// <reference path="../model/FrameTimer.ts"/>
var CompositionView = (function () {
    function CompositionView(compInfo) {
        var _this = this;
        this._maxTrackWidth = 0;
        this._trackHeight = 0;
        this._hScrollVal = 0;
        this.compInfo = compInfo;
        this.trackViewArr = [];
        this.compInfo.add(CompInfoEvent.UPDATE_CURSOR, function (frameIdx) {
            _this.updateCursor(frameIdx);
        });
        this.compInfo.add(CompInfoEvent.NEW_TRACK, function (trackInfo) {
            _this.onNewTrackView(trackInfo);
        });
        this.compInfo.add(CompInfoEvent.DEL_TRACK, function (idx) {
            _this.onDelTrackView(idx);
        });
        this.trackViewArr = [];
        this.setCompositionHeight($(CompositionId$).height());
        $(VScrollBarId$).on(ViewEvent.SCROLL, function () {
            var top = $(VScrollBarId$).scrollTop();
            $(CompositionId$).scrollTop(top);
            console.log(_this, 'scroll', top);
        });
        $(HScrollBarId$).on(ViewEvent.SCROLL, function () {
            _this.onHScroll();
        });
        $(ElmId$.timestampBar).on(MouseEvt.CLICK, function (e) {
            _this.onClkTimestampBar(e);
        });
        $(TrackHeightId$).width(1);
    }
    CompositionView.prototype.render = function () {
        return undefined;
    };
    CompositionView.prototype.setCompInfo = function (compInfo) {
        if (!compInfo.isInit) {
            this.compInfo = compInfo;
            this.compInfo.isInit = true;
        }
    };
    CompositionView.prototype.onClkTimestampBar = function (e) {
        var mouseX = e.clientX - $(ElmId$.timestampBar).offset().left;
        var cursorIdx = Math.floor((mouseX + this.compInfo.hScrollVal) / this.compInfo.frameWidth);
        this.compInfo.setCursor(cursorIdx);
    };
    CompositionView.prototype.onHScroll = function () {
        this._hScrollVal = $(HScrollBarId$).scrollLeft();
        this.compInfo.hScrollVal = this._hScrollVal;
        var frameWidth = appInfo.frameWidth();
        var clip$;
        for (var i = 0; i < this.compInfo.trackInfoArr.length; i++) {
            var trackInfo = this.compInfo.trackInfoArr[i];
            if (trackInfo) {
                var trackId$ = ElmClass$.Track + "#" + trackInfo.idx;
                clip$ = $(trackId$ + " " + ElmClass$.Clip);
                clip$.css({ left: trackInfo.getStart() * frameWidth - this._hScrollVal });
                console.log(this, clip$);
            }
        }
        this.updateCursor();
    };
    CompositionView.prototype.setTrackHeight = function (val) {
        $(TrackHeightId$).height(val);
    };
    CompositionView.prototype.setCompositionHeight = function (val) {
        $(VScrollBarId$).height(val);
    };
    CompositionView.prototype.onUpdateTrackStart = function (trackInfo) {
        this.updateMaxTrackWidth();
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
        //this.updateCursor(-1);
    };
    CompositionView.prototype.onSelTrackView = function (trackInfo) {
        var trackView;
        for (var i in this.trackViewArr) {
            trackView = this.trackViewArr[i];
            if (trackView) {
                if (trackView.trackInfo == trackInfo)
                    trackView.setSelected(true);
                else
                    trackView.setSelected(false);
            }
            console.log(this, i);
        }
    };
    CompositionView.prototype.updateCursor = function (frameIdx) {
        var fpos;
        if (frameIdx != -1) {
            fpos = frameIdx;
        }
        else
            fpos = this.compInfo.getCursor();
        $(ElmId$.cursor).css({
            left: fpos * appInfo.frameWidth() - this._hScrollVal
        });
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    };
    CompositionView.prototype.onSelectFrame = function (selArr) {
        this._selectFrame = selArr;
        var trackIdx = selArr[0];
        var frameIdx = selArr[1];
        for (var i = 0; i < this.trackViewArr.length; i++) {
            var trackView = this.trackViewArr[i];
            if (trackView) {
                if (i != trackIdx)
                    trackView.setActFrame(0);
                else
                    trackView.setActFrame(frameIdx);
            }
        }
    };
    CompositionView.prototype.onNewTrackView = function (trackInfo) {
        var _this = this;
        console.log(this, "onNewTrackView");
        trackInfo.add(TrackInfoEvent.SEL_TRACK, function (trackInfo) {
            _this.onSelTrackView(trackInfo);
        });
        trackInfo.add(TrackInfoEvent.UPDATE_TRACK_START, function (trackInfo) {
            _this.onUpdateTrackStart(trackInfo);
        });
        trackInfo.add(TrackInfoEvent.SEL_FRAME, function (selArr) {
            _this.onSelectFrame(selArr);
        });
        var view = new TrackView(trackInfo);
        this.trackViewArr.push(view);
        view.setParent($(CompositionId$));
        trackInfo.opacity(trackInfo.opacity());
        trackInfo.enable(trackInfo.enable());
        this._trackHeight += view.height();
        this.setTrackHeight(this._trackHeight);
        view.hScrollTo(this._hScrollVal);
        this.updateMaxTrackWidth();
        appInfo.dis(TheMachineEvent.UPDATE_IMG);
    };
    CompositionView.prototype.updateMaxTrackWidth = function () {
        var frameWidth = appInfo.frameWidth();
        var compMaxWidth = (this.compInfo.getMaxSize() + 4) * frameWidth;
        $(ElmId$.trackWidth).width(compMaxWidth);
    };
    CompositionView.prototype.onDelTrackView = function (idx) {
        console.log(this, "onDelTrackView", idx + '');
        //this.trackInfoArr.splice(idx, 1);
        //delete this.trackInfoArr[idx];
        this._trackHeight -= this.trackViewArr[idx].height();
        this.setTrackHeight(this._trackHeight);
        this.trackViewArr[idx].remove();
        delete this.trackViewArr[idx];
        //this.trackViewArr.splice(idx, 1);
    };
    return CompositionView;
})();
/// <reference path="BaseView.ts"/>
/// <reference path="CompositionView.ts"/>
/// <reference path="../model/ProjectInfo.ts"/>
var ProjectView = (function (_super) {
    __extends(ProjectView, _super);
    function ProjectView(projectInfo) {
        var _this = this;
        _super.call(this);
        this.compViews = [];
        if (projectInfo)
            this.projectInfo = projectInfo;
        else {
            throw "null project";
        }
        //this.projectInfo.add("newComp", this.onNewComp);
        this.projectInfo.add(CompInfoEvent.NEW_COMP, function (compInfo) {
            _this.onNewComp(compInfo);
        });
    }
    ProjectView.prototype.onNewComp = function (compInfo) {
        console.log(this, "onNewComp");
        var view = new CompositionView(compInfo);
        this.compViews.push(view);
    };
    return ProjectView;
})(BaseView);
/// <reference path="BaseView.ts"/>
var TimelineView = (function (_super) {
    __extends(TimelineView, _super);
    function TimelineView() {
        var _this = this;
        _super.call(this);
        this.el = $("#timeline");
        $(ElmId$.btnNewTrack).on(MouseEvt.CLICK, function () {
            _this.onNewTrack();
        });
        $(ElmId$.btnDelTrack).on(MouseEvt.CLICK, function () {
            _this.onDelTrack();
        });
        $(ElmId$.btnUpdate).on(MouseEvt.CLICK, function () {
            _this.updateImg();
        });
        this.initDrag();
    }
    TimelineView.prototype.updateImg = function () {
        appInfo.tm.updateWatchArr();
    };
    TimelineView.prototype.onDelTrack = function () {
        appInfo.projectInfo.curComp.delSelTrack();
        console.log("onDelSelTrack ");
    };
    TimelineView.prototype.onNewTrack = function () {
        var _this = this;
        chooseFile(ElmId$.newTrackDialog).change(function () {
            var val = $(ElmId$.newTrackDialog).val();
            if (val) {
                _this.newTrackByFilename(val);
                $(ElmId$.newTrackDialog).val("");
            }
        });
        console.log(this, "onNewTrack");
    };
    TimelineView.prototype.newTrackByFilename = function (filename) {
        var reg = /(.+)\\.+\.png/g;
        //todo unsupport type alert
        var a = reg.exec(filename);
        if (a.length > 1) {
            var folder = a[1];
            appInfo.projectInfo.curComp.newTrack(folder);
            console.log(this, filename, a[0], a[1]);
        }
    };
    TimelineView.prototype.initDrag = function () {
        var _this = this;
        window.ondragover = function (e) {
            e.preventDefault();
            return false;
        };
        window.ondrop = function (e) {
            e.preventDefault();
            return false;
        };
        var timeline = document.getElementById(TimelineId);
        timeline.ondragover = function () {
            //this.className = 'hover';
            //console.log(this, "dragOver");
            return false;
        };
        timeline.ondragleave = function () {
            //this.className = '';
            return false;
        };
        timeline.ondrop = function (e) {
            e.preventDefault();
            var file = e.dataTransfer.files[0];
            if (file.path) {
                _this.newTrackByFilename(file.path);
                console.log(_this, "ondrop", file.path);
            }
            //reader = new FileReader();
            //reader.onload = function (event) {
            //    console.log(event.target);
            //};
            //console.log(file);
            //var path = reader.readAsDataURL(file);
            //
            //return false;
        };
    };
    TimelineView.prototype.resize = function (w, h) {
        if (h != -1) {
            var trackToolBarHeight = $(TrackToolId$).height();
            var timeline = $(TimelineId$);
            timeline.height(h);
            var vScrollBar = $(VScrollBarId$);
            //vScrollBar.css({top: $(ViewportId$).position().bottom + trackToolBarHeight});
            //vScrollBar.css({top: timeline.position().top + trackToolBarHeight});
            var compositionHeight = h - trackToolBarHeight;
            vScrollBar.height(compositionHeight);
            $(CompositionId$).height(compositionHeight);
            $(ElmId$.cursorMask).height(compositionHeight + trackToolBarHeight);
        }
        if (w != -1) {
            var trackToolBarWidth = $(TrackToolId$).width();
            $(HScrollBarId$).width(w - 200);
            $(ElmId$.cursorMask).width(w);
        }
    };
    return TimelineView;
})(BaseView);
/// <reference path="../Node.ts"/>
/// <reference path="../event/ActEvent.ts"/>
/// <reference path="../JQuery.ts"/>
var gui = require('nw.gui');
var win = gui.Window.get();
var WindowView = (function () {
    function WindowView() {
        this.isMaximize = false;
        $("#btnClose").on(MouseEvt.CLICK, function () {
            win.close();
        });
        $("#btnDbg").on(MouseEvt.CLICK, function () {
            win.showDevTools('', true);
        });
        $("#btnMin").on(MouseEvt.CLICK, function () {
            win.minimize();
        });
        $("#btnMax").on(MouseEvt.CLICK, function () {
            if (this.isMaximize) {
                win.unmaximize();
                this.isMaximize = false;
            }
            else {
                win.maximize();
                this.isMaximize = true;
            }
        });
    }
    return WindowView;
})();
/// <reference path="../view/BaseView.ts"/>
/// <reference path="BaseWidget.ts"/>
var Direction;
(function (Direction) {
    Direction[Direction["Horizontal"] = 1] = "Horizontal";
    Direction[Direction["Vertical"] = 2] = "Vertical";
})(Direction || (Direction = {}));
var SplitterView = (function (_super) {
    __extends(SplitterView, _super);
    function SplitterView(dir, id$) {
        var _this = this;
        _super.call(this, id$);
        this._childNum = 0;
        this._isPress = false;
        this._dir = dir;
        $(this.id$).on(MouseEvt.DOWN, function () {
            if (_this._dir == Direction.Horizontal)
                _this._lastPos = appInfo.mouseX;
            else if (_this._dir == Direction.Vertical)
                _this._lastPos = appInfo.mouseY;
            _this._isPress = true;
            _this.startMoveTimer();
            console.log(_this, "startMoveTimer splitter", _this.id$);
        });
        appInfo.add(MouseEvt.UP, function () {
            _this._isPress = false;
            _this.stopMoveTimer();
        });
    }
    SplitterView.prototype.setChildren = function (c1, c2) {
        this._childId$1 = c1;
        this._childId$2 = c2;
    };
    SplitterView.prototype.startMoveTimer = function () {
        var _this = this;
        console.log(this, "startMoveTimer", "vsplitter");
        this._timerId = window.setInterval(function () {
            if (_this._isPress) {
                var splitter = $(_this.id$);
                if (_this._dir == Direction.Vertical) {
                    var child1 = $(_this._childId$1);
                    var dy = appInfo.mouseY - _this._lastPos;
                    _this._lastPos = appInfo.mouseY;
                    child1.height(child1.height() + dy);
                    _this.dis(ViewEvent.CHANGED, dy);
                }
                else if (_this._dir == Direction.Horizontal) {
                    var child1 = $(_this._childId$1);
                    var dx = appInfo.mouseX - _this._lastPos;
                    _this._lastPos = appInfo.mouseX;
                    child1.width(child1.width() + dx);
                    var hs = $(_this.id$);
                    hs.css({ left: hs.position().left + dx });
                    _this.dis(ViewEvent.CHANGED, dx);
                }
            }
        }, 20);
    };
    SplitterView.prototype.stopMoveTimer = function () {
        if (this._timerId) {
            window.clearInterval(this._timerId);
            //console.log(this, "stopMoveTimer", this._timerId);
            this._timerId = 0;
        }
    };
    SplitterView.prototype.addChild = function (val) {
        if (this._childNum == 0) {
            if (this._dir == Direction.Horizontal) {
            }
            else if (this._dir == Direction.Vertical) {
            }
        }
        else if (this._childNum == 1) {
        }
    };
    SplitterView.prototype.isHorizontal = function () {
        return this._dir == Direction.Horizontal;
    };
    SplitterView.prototype.isVertical = function () {
        return this._dir == Direction.Vertical;
    };
    SplitterView.prototype.getChild2Size = function () {
        if (this.isVertical())
            return $(this._childId$2).height();
        else if (this.isHorizontal())
            return $(this._childId$2).width();
    };
    SplitterView.prototype.getChild1Size = function () {
        if (this.isVertical())
            return $(this._childId$1).height();
        else if (this.isHorizontal())
            return $(this._childId$1).width();
    };
    return SplitterView;
})(BaseWidget);
/// <reference path="BaseView.ts"/>
/// <reference path="../model/TrackInfo.ts"/>
var CanvasView = (function (_super) {
    __extends(CanvasView, _super);
    function CanvasView() {
        _super.call(this);
    }
    CanvasView.prototype.init = function () {
        var c = document.getElementById("Canvas0");
        this.ctx = c.getContext("2d");
        this.canvasEl = c;
        this.resize(1280, 720);
    };
    CanvasView.prototype.resize = function (w, h) {
        this._width = w;
        this._height = h;
        this.canvasEl.setAttribute("width", w + "");
        this.canvasEl.setAttribute("height", h + "");
    };
    CanvasView.prototype.updateComp = function () {
        this.ctx.clearRect(0, 0, this._width, this._height);
        var trackInfoArr = appInfo.projectInfo.curComp.trackInfoArr;
        for (var i = trackInfoArr.length - 1; i > -1; i--) {
            var trackInfo = trackInfoArr[i];
            if (trackInfo && trackInfo.enable()) {
                var img = trackInfo.getCurImg(appInfo.projectInfo.curComp.getCursor());
                if (img) {
                    //console.log(this, "comp", img.src);
                    //this.ctx.save();
                    this.ctx.globalAlpha = trackInfo.opacity();
                    this.ctx.drawImage(img, 0, 0);
                    //this.ctx.restore();
                    this.savePng();
                }
                else {
                    console.log(this, "can not comp trk ", i);
                }
            }
        }
    };
    CanvasView.prototype.savePng = function () {
        //var dataURL = this.canvasEl.toDataURL('image/png');
        //console.log(this, dataURL);
        ////dataURL = dataURL.replace("image/png", "image/octet-stream");
        //var dataBuffer = new Buffer(dataURL, 'base64');
        //fs.writeFile("test.png", dataBuffer, function (err) {
        //    if (err) {
        //        //response.write(err);
        //        console.log(this, "err", err);
        //
        //    } else {
        //        console.log(this, "sus");
        //        //response.write("�����ɹ���");
        //    }
        //});
    };
    return CanvasView;
})(BaseView);
/// <reference path="../event/EventDispatcher.ts"/>
/// <reference path="BaseView.ts"/>
var SettingView = (function (_super) {
    __extends(SettingView, _super);
    function SettingView() {
        var _this = this;
        _super.call(this);
        this.btnToPageArr = [];
        this.btnToPageArr.push([ElmId$.tabButton0, ElmId$.tabPage0]);
        this.btnToPageArr.push([ElmId$.tabButton1, ElmId$.tabPage1]);
        this.btnToPageArr.push([ElmId$.tabButton2, ElmId$.tabPage2]);
        var onClickBtn = function (e) {
            var btnTarget$ = $(e.target);
            _this.showTabByAttrId(btnTarget$.attr("id"));
        };
        for (var i = 0; i < this.btnToPageArr.length; i++) {
            var btnToPage = this.btnToPageArr[i];
            $(btnToPage[1]).hide();
            $(btnToPage[0]).on(MouseEvt.CLICK, onClickBtn);
        }
        $(ElmId$.btnCloseSetting).on(MouseEvt.CLICK, function () {
            $(ElmId$.settingWin).hide();
            $(ElmId$.popupLayer).hide();
        });
        this.showTabByAttrId($(ElmId$.tabButton0).attr("id"));
    }
    SettingView.prototype.showTabByAttrId = function (id) {
        for (var i = 0; i < this.btnToPageArr.length; i++) {
            var btnToPage = this.btnToPageArr[i];
            var btn$ = $(btnToPage[0]);
            var page$ = $(btnToPage[1]);
            if (btn$.attr("id") == id) {
                page$.show();
                btn$.css({ background: "#555" });
            }
            else {
                page$.hide();
                btn$.css({ background: "#222" });
            }
        }
    };
    SettingView.prototype.setPage = function (idx) {
    };
    return SettingView;
})(BaseView);
/// <reference path="../model/AppInfo.ts"/>
/// <reference path="ProjectView.ts"/>
/// <reference path="TimelineView.ts"/>
/// <reference path="WindowView.ts"/>
/// <reference path="../widget/Splitter.ts"/>
/// <reference path="CanvasView.ts"/>
/// <reference path="SettingView.ts"/>
/// <reference path="../JQuery.ts"/>
var Keys = {
    Space: function (k) {
        return k == 32;
    },
    ESC: function (k) {
        return k == 27;
    },
    Char: function (key, c) {
        return key == c.charCodeAt(0);
    }
};
var AnimkView = (function () {
    function AnimkView(appModel) {
        var _this = this;
        this.appInfo = appModel;
        this.appInfo.add(ProjectInfoEvent.NEW_PROJ, function () {
            _this.onNewProject();
        });
        this.appInfo.add(TheMachineEvent.UPDATE_IMG, function () {
            _this.canvasView.updateComp();
        });
        document.onmousemove = function (e) {
            _this.appInfo.mouseX = e.clientX;
            _this.appInfo.mouseY = e.clientY;
        };
        document.onmouseup = function () {
            _this.appInfo.dis(MouseEvt.UP);
        };
        document.onkeydown = function (e) {
            _this.onKeyDown(e);
        };
        //super();
        var titleBarView = new WindowView();
        this.timelineView = new TimelineView();
        this.projectViewArr = [];
        this.canvasView = new CanvasView();
        this.initSettingView();
        this.initFileMenu();
    }
    AnimkView.prototype.initSettingView = function () {
        $.get('template/SettingWin.html', function (template) {
            var rendered = Mustache.render(template);
            $(ElmId$.popupLayer).html(rendered);
            this.settingView = new SettingView();
        });
    };
    AnimkView.prototype.initZIndex = function () {
        for (var i in ZIdx) {
            $(ZIdx[i]).css({ "z-index": 1000 + i });
        }
    };
    AnimkView.prototype.onKeyDown = function (e) {
        var key = e.keyCode;
        var isCtrl = e.ctrlKey;
        var isShift = e.shiftKey;
        var isAlt = e.altKey;
        if (Keys.Char(key, "F")) {
            appInfo.projectInfo.curComp.forward();
        }
        else if (Keys.Char(key, "D")) {
            appInfo.projectInfo.curComp.backward();
        }
        else if (Keys.Space(key)) {
            appInfo.projectInfo.curComp.toggle();
        }
        else if (Keys.ESC(key)) {
            appInfo.projectInfo.curComp.stayBack();
        }
        else if (Keys.Char(key, "\r")) {
            appInfo.tm.watchAct();
        }
        else if (Keys.Char(key, "O") && isCtrl) {
            this.fileMenuOpen();
        }
        else if (Keys.Char(key, "S") && isCtrl) {
            this.fileMenuSave();
        }
        //console.log(this, e, key, isCtrl, isShift,isAlt);
    };
    AnimkView.prototype.resize = function (w, h) {
        this.timelineView.resize(w, h - $(ViewportId$).height() - $(TitleBarId$).height() - 29 - $(ElmId$.bottomBar).height());
    };
    AnimkView.prototype.onNewProject = function () {
        console.log(this, 'new project');
        var view = new ProjectView(this.appInfo.projectInfo);
        this.projectViewArr.push(view);
    };
    AnimkView.prototype.initFileMenu = function () {
        var _this = this;
        $.get('template/TitleMenu.html', function (template) {
            var rendered = Mustache.render(template);
            $(ElmId$.titleMenu).html(rendered);
            var isShow = false;
            $(ElmId$.menuBtnFile).on(MouseEvt.CLICK, function () {
                isShow = !isShow;
                if (isShow)
                    $(ElmId$.fileMenu).css({ display: "block" });
                else
                    $(ElmId$.fileMenu).css({ display: "none" });
            });
            $(ElmId$.fileMenuNew).on(MouseEvt.CLICK, function () {
                $(ElmId$.fileMenu).css({ display: "none" });
            });
            $(ElmId$.fileMenuOpen).on(MouseEvt.CLICK, function () {
                _this.fileMenuOpen();
                $(ElmId$.fileMenu).css({ display: "none" });
            });
            $(ElmId$.fileMenuSave).on(MouseEvt.CLICK, function () {
                if (appInfo.projectInfo.saveFilename)
                    _this.fileMenuSave(appInfo.projectInfo.saveFilename);
                else
                    _this.fileMenuSave();
                $(ElmId$.fileMenu).css({ display: "none" });
            });
            $(ElmId$.fileMenuSaveAs).on(MouseEvt.CLICK, function () {
                _this.fileMenuSave();
                $(ElmId$.fileMenu).css({ display: "none" });
            });
        });
    };
    AnimkView.prototype.fileMenuOpen = function () {
        var _this = this;
        chooseFile(ElmId$.openFileDialog).change(function () {
            var filename = $(ElmId$.openFileDialog).val();
            console.log(_this, "open project file", filename);
            appInfo.openProject(filename);
        });
    };
    AnimkView.prototype.fileMenuSave = function (path) {
        var _this = this;
        if (isdef(path)) {
            appInfo.projectInfo.save(path);
        }
        else {
            chooseFile(ElmId$.saveAsDialog).change(function () {
                var filename = $(ElmId$.saveAsDialog).val();
                console.log(_this, "save as", filename);
                appInfo.projectInfo.save(filename);
            });
        }
    };
    AnimkView.prototype.onDomReady = function () {
        var _this = this;
        this.vSplitter = new SplitterView(Direction.Vertical, VSplitterId$);
        this.vSplitter.setChildren(ViewportId$, TimelineId$);
        this.vSplitter.add(ViewEvent.CHANGED, function (deltaVal) {
            //splitter.css({top: splitter.position().top + dy})
            _this.timelineView.resize(-1, $(TimelineId$).height() - deltaVal);
        });
        this.hSplitter = new SplitterView(Direction.Horizontal, ElmId$.hSplitter);
        this.hSplitter.setChildren(ElmId$.comp, ElmId$.toolShelf);
        win.on(ViewEvent.RESIZE, function (w, h) {
            _this.resize(w, h);
        });
        this.canvasView.init();
        this.initZIndex();
        appInfo.newProject();
    };
    return AnimkView;
})();
/// <reference path="JQuery.ts"/>
/// <reference path="model/AppInfo.ts"/>
/// <reference path="view/AppView.ts"/>
var app;
// Load the application once the DOM is ready, using `jQuery.ready`:
$(function () {
    // Finally, we kick things off by creating the **App**.
    app = new AnimkView(appInfo);
    app.onDomReady();
    appInfo.test(false);
});
