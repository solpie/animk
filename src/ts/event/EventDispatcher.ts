class EventDispatcher {
    _func:Object;
    _funcId:number;

    constructor() {
        this._func = {};
        this._funcId = 0;
    }

    add(type:string, func) {
        if (!this._func[type])
            this._func[type] = [];
        this._funcId++;
        this._func[type].push({func: func, id: this._funcId});
    }

    dis(type:string, param?) {
        if (this._func[type])
            for (var i = 0; i < this._func[type].length; ++i) {
                var f = this._func[type][i];
                if (f)
                    f.func(param);
            }
    }

    del(type:string, funcId:number) {
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
    }
}