module.exports = Point;

var Types = require('./types');
var BinaryWriter = require('./binarywriter');

function Point(x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toWkt = function () {
    if (typeof this.x === 'undefined' && typeof this.y === 'undefined')
        return Types.wkt.Point + ' EMPTY';

    return Types.wkt.Point + '(' + this.x + ' ' + this.y + ')';
};

Point.prototype.toWkb = function () {
    var wkb = new BinaryWriter(this._getWkbSize());

    wkb.writeInt8(1);

    if (typeof this.x === 'undefined' && typeof this.y === 'undefined') {
        wkb.writeInt32LE(Types.wkb.MultiPoint);
        wkb.writeInt32LE(0);
    }
    else {
        wkb.writeInt32LE(Types.wkb.Point);
        wkb.writeDoubleLE(this.x);
        wkb.writeDoubleLE(this.y);
    }

    return wkb.buffer;
};

Point.prototype._getWkbSize = function () {
    if (typeof this.x === 'undefined' && typeof this.y === 'undefined')
        return 1 + 4 + 4;

    return 1 + 4 + 8 + 8;
};