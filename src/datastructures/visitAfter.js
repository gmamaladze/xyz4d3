import Oct from "./oct";

export default function (callback) {
    var octs = [], next = [], q;
    if (this._root) octs.push(new Oct(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = octs.pop()) {
        var node = q.node;
        if (node.length) {
            var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            if (child = node[0]) octs.push(new Oct(child, x0, y0, xm, ym));
            if (child = node[1]) octs.push(new Oct(child, xm, y0, x1, ym));
            if (child = node[2]) octs.push(new Oct(child, x0, ym, xm, y1));
            if (child = node[3]) octs.push(new Oct(child, xm, ym, x1, y1));
        }
        next.push(q);
    }
    while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
}
