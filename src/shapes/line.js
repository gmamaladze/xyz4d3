"use strict";

/* global document:true */
import shape from "./shape.js";
import utils from "./utils.js";

export default line;

Object.setPrototypeOf(line, shape);

line.stroke = {
    path: "shape appearance material.emissiveColor",
    converter: (c) => utils.getColor(c),
    toString: (c) => utils.encodeColor(c)
};

line.strokeOpacity = {
    path: "shape appearance material.transparency",
    converter: (o) => utils.getTransparency(o)
};

line.points = {
    path: "shape lineset coordinate.point",
    converter: (points) => points.map(utils.encodePos).join(" ")
};

function line() {

    let transform = document.createElement("transform");
    let shape = document.createElement("shape");
    let lineset = document.createElement("lineset");
    lineset.setAttribute("solid", "true");
    lineset.setAttribute("useGeoCache", "false");
    let coordinates = document.createElement("coordinate");
    lineset.appendChild(coordinates);
    shape.appendChild(lineset);
    let appearance = document.createElement("appearance");
    let material = document.createElement("material");

    appearance.appendChild(material);
    shape.appendChild(appearance);
    shape.setAttribute("isPickable", "false");
    transform.appendChild(shape);
    return transform;
}
