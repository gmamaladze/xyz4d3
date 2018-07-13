export default function DragEvent(target, type, x, y, z, dx, dy, dz) {
    this.target = target;
    this.type = type;
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
}

DragEvent.prototype.on = function () {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
};
