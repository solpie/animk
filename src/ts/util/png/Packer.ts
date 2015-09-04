/// <reference path="Filter.ts"/>
/// <reference path="../../Node.ts"/>

class Packer {
    _options;
    PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    TYPE_IHDR = 0x49484452;
    TYPE_IDAT = 0x49444154;
    TYPE_IEND = 0x49454e44;
    crcTable;

    constructor(options) {
        this._options = options;
        options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
        options.deflateLevel = options.deflateLevel || 9;
        options.deflateStrategy = options.deflateStrategy || 3;

        this.initCrc();
    }

    initCrc() {
        this.crcTable = [];
        for (var i = 0; i < 256; i++) {
            var c = i;
            for (var j = 0; j < 8; j++) {
                if (c & 1) {
                    c = 0xedb88320 ^ (c >>> 1);
                } else {
                    c = c >>> 1;
                }
            }
            this.crcTable[i] = c;
        }
    }

    pack(pixelData, width, height, depthInBytes,path) {
        var bufs = [];
        bufs.push(new Buffer(this.PNG_SIGNATURE));
        bufs.push(this._packIHDR(width, height, depthInBytes));
        var filter = new Filter(width, height, depthInBytes, 4, pixelData, this._options); //UNDO : feed image depth
        var dataFilter = filter.filter();

        var deflate = zlib.createDeflate({
            chunkSize: this._options.deflateChunkSize,
            level: this._options.deflateLevel,
            strategy: this._options.deflateStrategy
        });
        //deflate.on('error', this.emit.bind(this, 'error'));

        deflate.on('data', (data)=> {
            bufs.push(this._packIDAT(data));
        });

        deflate.on('end', ()=> {
            bufs.push(this._packIEND());
            var stream2 = fs.createWriteStream(path);
            stream2.write(Buffer.concat(bufs));
            stream2.close();
        });

        deflate.end(dataFilter);
    }

    write(path) {
        //var stream2 = fs.createWriteStream(path);
        //stream2.write(Buffer.concat(bufs));
        //stream2.close();
    }

    _packIHDR(width, height, depthInBytes) {
        var buf = new Buffer(13);
        buf.writeUInt32BE(width, 0);
        buf.writeUInt32BE(height, 4);
        buf[8] = depthInBytes * 8; //UNDO : original value : 8
        buf[9] = 6; // colorType
        buf[10] = 0; // compression
        buf[11] = 0; // filter
        buf[12] = 0; // interlace

        return this._packChunk(this.TYPE_IHDR, buf);
    }

    _packIDAT(data) {
        return this._packChunk(this.TYPE_IDAT, data);
    }

    _packIEND() {
        return this._packChunk(this.TYPE_IEND, null);
    }

    _packChunk(type, data) {

        var len = (data ? data.length : 0),
            buf = new Buffer(len + 12);

        buf.writeUInt32BE(len, 0);
        buf.writeUInt32BE(type, 4);

        if (data) data.copy(buf, 8);
        buf.writeInt32BE(this.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
        return buf;
    }

    crc32(buf) {
        var crc = -1;
        for (var i = 0; i < buf.length; i++) {
            crc = this.crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        return crc ^ -1;
    }

}