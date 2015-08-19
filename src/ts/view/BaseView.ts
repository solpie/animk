class BaseObj {
    thisObj:BaseObj;

    constructor() {
        this.thisObj = this;
    }
}
interface IBaseView {
    render():void;
}
class BaseView extends BaseObj {
    constructor() {
        super();
    }
}