"use strict";

import utils from "./utils.js";

export default div2d;

div2d.position = {
    path: ".style",
    converter: (xyz) => {
        xyz = utils.toXyz(xyz);
        let pos = vis.runtime.calcCanvasPos(xyz.x, xyz.y, xyz.z);
        let rect = vis.x3.node().getBoundingClientRect();
        let left = pos[0];
        let top = pos[1] - 30;
        let isOutOfBounds = left < rect.left || left > rect.right || top < rect.top || top > rect.bottom;
        let visibility = isOutOfBounds ? "hidden" : "visible";
        return `left:${left};top:${top};visibility:{$visibility}`;
    },
    toString: (_) => _
};


function div2d() {
    var div = document.createElement("div");
    return div;
}