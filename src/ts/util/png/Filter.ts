/// <reference path="../../Node.ts"/>

class Filter {
    _width;
    _height;
    _depthInBytes;
    //_Bpp;
    _data;
    _options;
    _line;
    _filters;

    constructor(width, height, depthInBytes, Bpp, data, options) {
        this._width = width;
        this._height = height;
        this._depthInBytes = depthInBytes;
        //this._Bpp = Bpp;
        this._data = data;
        this._options = options;

        this._line = 0;

        if (!('filterType' in options) || options.filterType == -1) {
            options.filterType = [0, 1, 2, 3, 4];
        } else if (typeof options.filterType == 'number') {
            options.filterType = [options.filterType];
        }
        this._filters = {
            0: this._filterNone.bind(this),
            //1: this._filterSub.bind(this),
            //2: this._filterUp.bind(this),
            //3: this._filterAvg.bind(this),
            //4: this._filterPaeth.bind(this)
        };

    }

    filter() {
        var pxData = this._data,
            rawData = new Buffer(((this._width << (2 + this._depthInBytes - 1)) + 1) * this._height);
        //rawData.fill(0);
        for (var y = 0; y < this._height; y++) {
            // find best filter for this line (with lowest sum of values)
            var filterTypes = this._options.filterType,
                min = Infinity,
                sel = 0;

            for (var i = 0; i < filterTypes.length; i++) {
                var sum = this._filters[filterTypes[i]](pxData, y, null);
                if (sum < min) {
                    sel = filterTypes[i];
                    min = sum;
                }
            }

            this._filters[sel](pxData, y, rawData);
        }
        return rawData;
    }

    _filterNone(pxData, y, rawData) {
        var pxRowLength = this._width << (2 + this._depthInBytes - 1),
            rawRowLength = pxRowLength + 1,
            sum = 0;

        if (!rawData) {
            for (var x = 0; x < pxRowLength; x++)
                sum += Math.abs(pxData[y * pxRowLength + x]);

        } else {
            rawData[y * rawRowLength] = 0;
            pxData.copy(rawData, rawRowLength * y + 1, pxRowLength * y, pxRowLength * (y + 1));
        }
        return sum;
    }
}