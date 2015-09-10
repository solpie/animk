/// <reference path="../ImageInfo.ts"/>
/// <reference path="../../util/psd2png/PsdParser.ts"/>

class POI {
    filename:string;//psd path
    basename:string;
    imageLayerInfoArr:Array<ImageLayerInfo> = [];
    isBeingWatched:boolean = false;
    watchCallback:any;

    psd2png() {
        if (this.filename) {
            var psdParser = new PsdParser();
            var psd = psdParser.parse(this.filename);
            for (var i = 0; i < this.imageLayerInfoArr.length; i++) {
                var imageLayerInfo:ImageLayerInfo = this.imageLayerInfoArr[i];
                if (!imageLayerInfo.isRef) {
                    psd.getDescendants()[this.imageLayerInfoArr.length - 1 - i].saveAsPng(imageLayerInfo.filename, ()=> {
                        console.log(this, "psd2png", imageLayerInfo.filename);
                        imageLayerInfo.imageInfo.reloadImg();
                    });
                }
            }
        }
        else {
            throw new Error("no psd filename")
        }
    }

}