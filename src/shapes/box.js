'use strict';

/* global document:true */

import utils from "./utils.js";
import shape from "./shape.js";
export default box;

Object.setPrototypeOf(box, shape);

box.size = {
    path: "shape box.size",
    converter: (s) => utils.toXyz(s),
    toString: (s) => utils.encodePos(s)
};

box.width = {
    path: "shape box.size",
    converter: (x) => {
        return {x}
    },
    toString: (x) => utils.encodePos(x)
};

box.height = {
    path: "shape box.size",
    converter: (y) => {
        return {y}
    },
    toString: (y) => utils.encodePos(y)
};

box.depth = {
    path: "shape box.size",
    converter: (z) => {
        return {z}
    },
    toString: (z) => utils.encodePos(z)
};


function box() {
    return shape("box")
}
