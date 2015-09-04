class Descriptor {
    data;
    file;
    types;

    constructor() {
    }

    init(file) {
        this.types = {
            'obj ': this.parseReference,
            'Objc': this.parseDescriptor,
            'VlLs': this.parseList,
            'doub': this.parseDouble,
            'UntF': this.parseUnitFloat,
            'TEXT': this.parseString,
            'enum': this.parseEnumerated,
            'long': this.parseInteger,
            'bool': this.parseBoolean,
            'GlbO': this.parseDescriptor,
            'type': this.parseClass,
            'GlbC': this.parseClass,
            'alis': this.parseAlias,
            'tdta': this.parseRawData
        };
        this.data = {};
        this.file = file;
        this.parse();
        return this.data
    }

    parse() {
//    this.file = file;
        this.data.class = this.parseClass();
        var itemNum = this.file.readInt();

        for (var i = 0; i < itemNum; i++) {
            var o = this.parseKeyItem();
            this.data[o.id] = o.value;
        }
        return this.data
    }

    parseClass() {
        return {
            name: this.file.readUnicodeString(),
            id: this.parseID()
        }
    }

    parseID() {
        var len = this.file.readInt() || 4;
        return this.file.readString(len)
    }

    parseKeyItem() {
        return {
            id: this.parseID(),
            value: this.parseItem()
        }
    }

    parseItem() {
        var key = this.file.readString(4);
//    console.log(this.types[key], key)
        return this.types[key].call(this);
    }

    parseBoolean() {
        return this.file.readBoolean()
    }


    parseDouble() {
        return this.file.readDouble()
    }


    parseInteger() {
        return this.file.readInt()
    }


    parseIndex() {
        return this.file.readInt()
    }


    parseOffset() {
        return this.file.readInt()
    }


    parseString() {
//    console.log(this)
        return this.file.readUnicodeString()
    }


    parseProperty() {
        return {
            class: this.parseClass(),
            id: this.parseID()
        }
    }


    parseEnumerated() {
        return {
            type: this.parseID(),
            value: this.parseID()
        }
    }


    parseEnumeratedReference() {
        return {
            class: this.parseClass(),
            type: this.parseID(),
            value: this.parseID()
        }
    }


    parseAlias() {
        var len = this.file.readInt();
        return this.file.readString(len)
    }


    parseList() {
        var itemNum = this.file.readInt();
        var data = [];
        for (var i = 0; i < itemNum; i++) {
            data.push(this.parseItem());
        }
        return data
    }


    parseRawData() {
        return this.file.read(this.file.readInt())
    }


    parseDescriptor() {
        return new Descriptor().init(this.file)
    }


    parseReference() {
        var types = {
            'prop': this.parseProperty,
            'Clss': this.parseClass,
            'Enmr': this.parseEnumeratedReference,
            'rele': this.parseOffset,
            //'Idnt': this.parseIdentifier,
            'indx': this.parseIndex,
            //'name': this.parseName,
        };
        var data = [];
        var itemNum = this.file.readInt();
        for (var i = 0; i < itemNum; i++) {
            var key = this.file.readString(4);
            data.push({
                type: key,
                value: types[key].call(this)
            });
        }
        return data
    }


    parseUnitFloat() {
        var types = {
            '#Ang': 'Angle',
            '#Rsl': 'Density',
            '#Rlt': 'Distance',
            '#Nne': 'None',
            '#Prc': 'Percent',
            '#Pxl': 'Pixels',
            '#Mlm': 'Millimeters',
            '#Pnt': 'Points'
        };
        var unit = types[this.file.readString(4)],
            value = this.file.readDouble();
        return {
            unit: unit,
            value: value
        }
    }
}