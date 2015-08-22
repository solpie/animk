/// <reference path="BaseView.ts"/>
enum Direction  {
    Horizontal = 1,
    Vertical
}

class SplitterView extends BaseView {
    _dir:number;
    _childId$1:string;
    _childId$2:string;
    _childNum:number = 0;
    _isPress:boolean = false;
    _lastPos:number;
    _timerId:number;

    constructor(dir:number, id$:string) {
        super(id$);
        this._dir = dir;
        $(this.id$).on(MouseEvt.DOWN, ()=> {
            if (this._dir == Direction.Horizontal)
                this._lastPos = appInfo.mouseX;
            else if (this._dir == Direction.Vertical)
                this._lastPos = appInfo.mouseY;
            this._isPress = true;
            this.startMoveTimer();
            console.log(this, "startMoveTimer splitter", this.id$);
        });

        appInfo.add(MouseEvt.UP, ()=> {
            this._isPress = false;
            this.stopMoveTimer();
        });
    }

    setChildren(c1:string, c2:string) {
        this._childId$1 = c1;
        this._childId$2 = c2;
    }

    startMoveTimer() {
        console.log(this, "startMoveTimer", "vsplitter");
        this._timerId = window.setInterval(()=> {
            if (this._isPress) {
                var splitter = $(this.id$);
                if (this._dir == Direction.Vertical) {
                    var child1 = $(this._childId$1);
                    var dy = appInfo.mouseY - this._lastPos;
                    this._lastPos = appInfo.mouseY;
                    child1.height(child1.height() + dy);
                    this.dis(ViewEvent.CHANGED, dy);
                    //splitter.css({top: splitter.position().top + dy})
                }
                else if (this._dir == Direction.Horizontal) {
                    var child1 = $(this._childId$1);
                    var dx = appInfo.mouseX - this._lastPos;
                    this._lastPos = appInfo.mouseX;
                    child1.width(child1.width() + dx);
                    var hs = $(this.id$);
                    hs.css({left: hs.position().left + dx});
                    this.dis(ViewEvent.CHANGED, dx);
                    //var c2 = $(this._childId$2);
                    //c2.css({left: hs.width() +hs.position().left+ dx});
                }
            }
        }, 20);
    }

    stopMoveTimer() {
        if (this._timerId) {
            window.clearInterval(this._timerId);
            //console.log(this, "stopMoveTimer", this.timerId);
            this._timerId = 0;
        }
    }


    addChild(val:string) {
        if (this._childNum == 0) {
            if (this._dir == Direction.Horizontal) {

            }
            else if (this._dir == Direction.Vertical) {

            }
        }
        else if (this._childNum == 1) {

        }
    }

    isHorizontal() {
        return this._dir == Direction.Horizontal;
    }

    isVertical() {
        return this._dir == Direction.Vertical;
    }

    getChild2Size() {
        if (this.isVertical())
            return $(this._childId$2).height();
        else if (this.isHorizontal())
            return $(this._childId$2).width();
    }

    getChild1Size() {
        if (this.isVertical())
            return $(this._childId$1).height();
        else if (this.isHorizontal())
            return $(this._childId$1).width();
    }
}