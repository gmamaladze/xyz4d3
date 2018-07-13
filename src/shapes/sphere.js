'use strict';

/* global document:true */

import shape from "./shape.js";
export default sphere;

Object.setPrototypeOf(sphere, shape);

sphere.radius = {
    path: "shape sphere.radius",
    converter: (r) => r,
};

sphere.cx = shape.x;

sphere.cy = shape.y;

sphere.cz = shape.z;


function sphere() {
    return shape("sphere");
}
