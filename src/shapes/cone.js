"use strict";

/* global document:true */
import shape from "./shape.js";

export default cone;

Object.setPrototypeOf(cone, shape);

cone.height = {
    path: "shape cone.height",
    converter: (h) => h,
};

cone.radius = cone.bottomRadius = {
    path: "shape cone.bottomRadius",
    converter: (r) => r,
};

cone.bottomRadius = {
    path: "shape cone.topRadius",
    converter: (r) => r,
};

cone.width = cone.depth = {
    path: "shape cone.bottomRadius",
    converter: (w) => w / 2,
};

function cone() {
    return shape("cone");
}
