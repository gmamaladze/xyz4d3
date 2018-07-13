'use strict';
/* global d3:true */

export default {
    encodePos,
    toTuple,
    toXyz,
    getColor,
    getTransparency,
    encodeColor
};

function encodeTuple(tuple) {
    return tuple.join(" ");
}

function toXyz(pos) {
    return Array.isArray(pos) ? {x: pos[0], y: pos[1], z: pos[2]} : pos;
}

function toTuple(pos) {
    return Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z];
}

function encodePos(pos) {
    return encodeTuple(toTuple(pos));
}

function encodeColor(c) {
    return encodeTuple([c.r, c.g, c.b]);
}

var scale255 = d3.scaleLinear().domain([0, 255]).range([0, 1]);

function getColor(cssColor) {
    let color = d3.color(cssColor);
    return {
        r: scale255(color.r),
        g: scale255(color.g),
        b: scale255(color.b)
    };
}

function getTransparency(opacity) {
    return 1 - opacity;
}
