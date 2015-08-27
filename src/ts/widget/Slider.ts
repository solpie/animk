/// <reference path="BaseWidget.ts"/>
/// <reference path="../JQuery.ts"/>
/// <reference path="../event/ActEvent.ts"/>
class Slider extends BaseWidget {
    _isPress:Boolean;

    constructor(id$) {
        super(id$);
        $(id$).on(MouseEvt.DOWN, ()=> {
            this.onDown();
        });

        appInfo.add(MouseEvt.UP, ()=> {
            this.onUp();
        });
    }

    onUp() {
        if (this._isPress) {
            this._isPress = false;
        }
    }

    setBarWidth(val) {

    }

    onDown() {
        this._isPress = true;
        this.updateValueByPos();
    }

    updateValueByPos() {

    }
}