class BaseObj {
    thisObj:BaseObj;

    constructor() {
        this.thisObj = this;
    }
}

class BaseView extends BaseObj {
    constructor() {
        super();
    }
}