/// <reference path="../ImageInfo.ts"/>
/// <reference path="../../util/psd2png/PsdParser.ts"/>

class POI {
    filename:string;//psd path
    imageInfoArr:Array<ImageInfo> = [];

    psd2png() {
        if (this.filename) {
            var psdParser = new PsdParser();
            var psd = psdParser.parse(this.filename);
            for (var i = 0; i < this.imageInfoArr.length; i++) {
                var imageInfo:ImageInfo = this.imageInfoArr[i];
                if (!imageInfo.isRef) {
                    console.log(this, "psd2png", imageInfo.filename);
                    psd.getDescendants()[i].saveAsPng(imageInfo.filename + "test.png");
                }
            }
        }
        else {
            throw new Error("no psd filename")
        }

    }
}