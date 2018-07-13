"use strict";

/* global document:true */
import shape from "./shape.js";

export default cylinder;

Object.setPrototypeOf(cylinder, shape);

cylinder.height = {
    path: "shape cylinder.height",
    converter: (h) => h,
};

cylinder.radius = {
    path: "shape cylinder.radius",
    converter: (r) => r,
};

cylinder.width = cylinder.depth = {
    path: "shape cylinder.radius",
    converter: (w) => w / 2,
};

function cylinder() {
    return shape("cylinder");
}
