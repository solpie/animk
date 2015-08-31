/// <reference path="BaseWidget.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../event/ActEvent.ts"/>
class Slider extends BaseWidget {
    _isPress:Boolean;
    _timerId:number = 0;
    _minVal:number = 0;
    _maxVal:number = 1;
    _width:number;
    _value:number;
    _rangeVal:number = 1;

    constructor(id$) {
        super(id$);
        $(id$).on(MouseEvt.DOWN, ()=> {
            this.onDown();
        });

        appInfo.add(MouseEvt.UP, ()=> {
            this.onUp();
        });

        this._width = $(this.id$).width();
    }

    startMoveTimer() {
        this._timerId = setInterval(()=> {
            var barWidth = appInfo.mouseX - $(this.id$).position().left;
            if (barWidth > this._width)
                barWidth = this._width;
            if (barWidth < 0)
                barWidth = 0;
            this._value = barWidth / this._width * this._rangeVal;
            //change view
            //$(this.id$ + " " + ".Bar").width(barWidth);
            //$(this.id$ + " " + ".Label").html(parseInt(this._value * 100) + "%");
            this.dis(ViewEvent.CHANGED, this._value);
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
            $(this.id$ + " " + ".Label").css({display: "none"});
        }
    }

    setBarWidth(val) {
        $(this.id$ + " " + ".Bar").width(this._width * val);
        $(this.id$ + " " + ".Label").html(Math.floor(this._value * 100) + "%");
    }

    setRange(min:number, max:number) {
        this._maxVal = max;
        this._minVal = min;
        this._rangeVal = max - min;
    }

    onDown() {
        this._isPress = true;
        $(this.id$ + " " + ".Label").css({display: "block"});
        this.dis(ViewEvent.CHANGED, this._value);
        this.startMoveTimer();
    }

}