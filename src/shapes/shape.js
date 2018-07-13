"use strict";

import utils from "./utils.js";
import group from "./group.js";

export default shape;

Object.setPrototypeOf(shape, group);


shape.fill = {
    path: "shape appearance material.diffuseColor",
    converter: (c) => utils.getColor(c),
    toString: (c) => utils.encodeColor(c)
};

shape.opacity = {
    path: "shape appearance material.transparency",
    converter: (o) => utils.getTransparency(o)
};


function shape(tagName, onAdded) {
    let transform = group();
    let shape = document.createElement("shape");
    transform.appendChild(shape);
    let appearance = document.createElement("appearance");

    let material = document.createElement("material");
    appearance.appendChild(material);

    shape.appendChild(appearance);
    let primitive = document.createElement(tagName);
    primitive.setAttribute("useGeoCache", "false");
    shape.appendChild(primitive);
    if (onAdded) onAdded(primitive);
    return transform;
}
