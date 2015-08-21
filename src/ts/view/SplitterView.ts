/// <reference path="BaseView.ts"/>
enum Direction  {
    Horizontal = 1,
    Vertical
}

class SplitterView extends BaseView {
    _dir:number;
    _child1:Object;
    _child2:Object;
    _childNum:number = 0;
    _isPress:boolean = false;
    _lastPos:number;
    _timerId:number;

    constructor(dir:number, id$:string) {
        super(id$);
        this._dir = dir;
        console.log(this, "new splitter",$(this.id$),$("#VSplitter0"));
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

    startMoveTimer() {
        console.log(this, "startMoveTimer","vsplitter");
        this._timerId = window.setInterval(()=> {
            if (this._isPress) {
                var splitter = $(this.id$);
                if (this._dir == Direction.Vertical) {
                    var child1 = $("#Viewport0");

                    var dy = appInfo.mouseY - this._lastPos;
                    this._lastPos = appInfo.mouseY;
                    child1.height(child1.height() + dy);
                    //splitter.css({top: splitter.position().top + dy})
                }
                else if (this._dir == Direction.Horizontal) {
                    var dx = appInfo.mouseX - this._lastPos;
                    this._lastPos = appInfo.mouseX;
                    splitter.css({left: splitter.position().left + dx})
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


}