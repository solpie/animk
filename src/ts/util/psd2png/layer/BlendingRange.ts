class BlendingRange{
    grey:any;
    channels:Array<any>;
}
function parseBlendingRange(file){
    var length = file.readInt(),
        endPos = file.now() + length;

    var blendingRange = new BlendingRange();

    blendingRange.grey = {
        source: {
            black: [file.readByte(), file.readByte()],
            white: [file.readByte(), file.readByte()]
        },
        dist: {
            black: [file.readByte(), file.readByte()],
            white: [file.readByte(), file.readByte()]
        }
    };
    var num = (length-8)/8;
    blendingRange.channels = [];
    for(var i=0; i<num; i++){
        blendingRange.channels.push({
            source: {
                black: [file.readByte(), file.readByte()],
                white: [file.readByte(), file.readByte()]
            },
            dist: {
                black: [file.readByte(), file.readByte()],
                white: [file.readByte(), file.readByte()]
            }
        })
    }

    return blendingRange;
}