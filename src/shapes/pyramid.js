"use strict";

/* global document:true */
import shape from "./shape.js";

export default pyramid;

Object.setPrototypeOf(pyramid, shape);

pyramid.height = {
    path: "shape pyramid.height",
    converter: (h) => h,
};

pyramid.xbottom = pyramid.width = {
    path: "shape pyramid.xbottom",
    converter: (x) => x,
};

pyramid.ybottom = pyramid.depth = {
    path: "shape pyramid.ybottom",
    converter: (y) => y,
};

pyramid.xtop = {
    path: "shape pyramid.xtop",
    converter: (x) => x,
};

pyramid.ytop = {
    path: "shape pyramid.ytop",
    converter: (y) => y,
};

pyramid.xoff = {
    path: "shape pyramid.xoff",
    converter: (x) => x,
};

pyramid.yoff = {
    path: "shape pyramid.yoff",
    converter: (y) => y,
};

function pyramid() {
    return shape("pyramid");
}
