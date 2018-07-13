"use strict";

import utils from "./utils.js";

export default group;


group.position = {
    path: ".translation",
    converter: (pos) => utils.toXyz(pos),
    toString: (pos) => utils.encodePos(pos)
};

group.x = {
    path: ".translation",
    converter: (x) => {
        return {x}
    },
    toString: (pos) => utils.encodePos(pos)
};

group.y = {
    path: ".translation",
    converter: (y) => {
        return {y}
    },
    toString: (pos) => utils.encodePos(pos)
};

group.z = {
    path: ".translation",
    converter: (z) => {
        return {z}
    },
    toString: (pos) => utils.encodePos(pos)
};

function group() {
    let transform = document.createElement("transform");
    return transform;
}
