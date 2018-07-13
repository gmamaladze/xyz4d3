"use strict";

/* global document:true */
import shape from "./shape.js";

export default text;

Object.setPrototypeOf(text, shape);

text.fontFamily = {
    path: "shape text fontstyle.family",
    converter: (f) => f,
};

text.fontSize = {
    path: "shape text fontstyle.size",
    converter: (s) => s,
};

text.fontJustify = {
    path: "shape text fontstyle.justify",
    converter: (j) => j,
};

text.fontQuality = {
    path: "shape text fontstyle.quality",
    converter: (q) => q,
};

text.text = {
    path: "shape text.string",
    converter: (q) => q,
};

function text() {
    let result = shape("text", (el) => {
        let fontstyle = document.createElement("fontstyle");
        el.appendChild(fontstyle);
    });
    result.setAttribute("solid", "true");
    return result;
}
