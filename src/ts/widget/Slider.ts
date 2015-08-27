/// <reference path="BaseWidget.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../event/ActEvent.ts"/>
class Slider extends BaseWidget {
    _isPress:Boolean;
    _timerId:number = 0;

    constructor(id$) {
        super(id$);
        $(id$).on(MouseEvt.DOWN, ()=> {
            this.onDown();
        });

        appInfo.add(MouseEvt.UP, ()=> {
            this.onUp();
        });
    }

    startMoveTimer() {
        this._timerId = setInterval(()=> {
            var barWidth = appInfo.mouseX - $(this.id$).position().left;
            if(barWidth>$(this.id$).width())
                barWidth = $(this.id$).width();
            $(this.id$ + " " + ".Bar").width(barWidth);
            console.log(this, "barWidth", barWidth);
        }, 20);
    }

    stopMoveTimer() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = 0;
        }
    }

    onUp() {
        if (this._isPress) {
            this._isPress = false;
            this.stopMoveTimer();
        }
    }

    setBarWidth(val) {

    }

    onDown() {
        this._isPress = true;
        this.updateValueByPos();
        this.startMoveTimer();
    }

    updateValueByPos() {

    }
}