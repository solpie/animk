
function newLayer(l) {
    function text() {
        //文本内容
        if (this.additional['TySh']) {
            return this.additional['TySh']['textData']['Txt ']
        }
        else {
            console.error('This layer (%s) is not a text layer', this.get('layerName'));
            return false;
        }
    }

    function snippets() {
        //文本图层的详细内容
        if (this.additional['TySh']) {
            //it`s an array
            console.log(this, "no need");
            //return parseTextLayer(this.additional['TySh'])
        }
        else {
            console.error('This layer (%s) is not a text layer', this.get('layerName'));
            return false;
        }
    }

    function _get(name) {
        if (this[name]) {
            return this[name];
        }
        else if (this.additional[name]) {
            return this.additional[name];
        }
        else {
            console.error('%s attribute not exist', name);
            return false;
        }
    }

    l.get = function (name) {
        switch (name) {

            case 'layerName':
                return this.additional['luni'];
                break;

            case 'text':
                return text.call(this);
                break;

            case 'wordSnippets':
                return snippets.call(this);
                break;

            default :
                return _get.call(this, name);
        }
    };
    return l;
}
class Handler {
    _psd_;
    _children;
    _tree;
    _childrenWithGroup;

    constructor(PSD) {
        this._psd_ = PSD;
    }

    saveAsPng(output) {
        // 整体psd缩略图
        this._psd_.imageData.saveAsPng(output);
    }

    getDescendants() {
        // 获取 扁平化的图层
        if (this._children) return this._children;
        this._children = [];
        this._childrenWithGroup = [];

        this._psd_.layerMaskInfo.layerInfo.layers.forEach((l)=> {
            var layer = newLayer(l);
            this._childrenWithGroup.push(layer);
            if (!l.additional['lsct']) this._children.push(layer);
        });
        return this._children
    }

    getTree() {
        // 获取 树型图层
        if (this._tree) return this._tree;

        if (!this._childrenWithGroup) this.getDescendants();

        var layers = this._childrenWithGroup;

        var current = [];
        var queue = [];
        layers.forEach(function (el) {
            var groupSig = el.additional['lsct'];
            if (groupSig && (groupSig.type === 1 || groupSig.type === 2)) {
                // group start
                var g = el;
                g.type = 'group';
                g.children = [];

                current.push(g);
                queue.push(current);
                current = g.children;
            }
            else if (groupSig && groupSig.type === 3) {
                // group end
                current = queue.pop();
            }
            else {
                // other layer ,not group
                current.push(el);
            }
        });
        this._tree = current;
        return this._tree
    }

    getSlices() {
        // 获取切片
        var _slice = this._psd_.imageResources.imageResourceBlock['1050'];

        var slices = [];
        if (_slice.slices) {
            //version > 7
            _slice.slices.forEach(function (s) {
                slices.push({
                    id: s['sliceID'],
                    groupId: s['groupID'],
                    name: s['Nm  '],

                    left: s['bounds']['Left'],
                    top: s['bounds']['Top '],
                    right: s['bounds']['Rght'],
                    bottom: s['bounds']['Btom'],

                    message: s['Msge'],
                    alt: s['altTag'],
                    url: s['url'],
                    target: s['null'],
                    isHTML: s['cellTextIsHTML'],
                    cellText: s['cellText']
                })
            })
        } else {
            //version = 6
            _slice.forEach(function (s) {
                slices.push({
                    id: s['ID'],
                    groupId: s['groupID'],
                    name: s['name'],

                    left: s['left'],
                    top: s['top'],
                    right: s['right'],
                    bottom: s['bottom'],

                    message: s['message'],
                    alt: s['alt'],
                    url: s['url'],
                    target: s['target'],
                    isHTML: s['isHTML'],
                    cellText: s['cellText']
                })
            })
        }
        return slices
    }
}