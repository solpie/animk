/// <reference path="../event/EventDispatcher.ts"/>

class BaseWidget extends EventDispatcher {
    id$:string;

    constructor(id$?) {
        super();
        if (id$)
            this.id$ = id$;
    }
}