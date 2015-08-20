class EventDispatcher {
    _func:Object;

    constructor() {
        this._func = {};
    }

    add(type:string, func) {
        if (!this._func[type])
            this._func[type] = [];
        this._func[type].push(func);
    }

    dis(type:string, param?) {
        if (this._func[type])
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                f(param);
            }
    }
}