(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.xyz4d3 = global.xyz4d3 || {})));
}(this, (function (exports) { 'use strict';

function attrdeep(path, value) {
    let dotIndex = path.lastIndexOf(".");
    let selectorName = path.substr(0, dotIndex);
    let attr = path.substr(dotIndex + 1, path.length);
    let selector = selectorName.length ? this.select(selectorName) : this;
    let result = selector.attr(attr, value);
    if (arguments.length === 2) {
        return this;
    } else {
        return result;
    }
}


function attr3d(fieldSpec, varOrFunc) {

    let isString = (typeof fieldSpec === 'string');
    let path = isString ? fieldSpec : fieldSpec.path;
    let converter = isString ? _ => _ : fieldSpec.converter;

    let dotIndex = path.lastIndexOf(".");
    let selectorName = path.substr(0, dotIndex);
    let attrName = path.substr(dotIndex + 1, path.length);
    let selector = selectorName.length ? this.select(selectorName) : this;

    let toString = isString ? _ => _ : fieldSpec.toString;
    toString = toString ? toString : _ => _;

    if (arguments.length === 2) {
        selector.attr(attrName, calculateValue);
        return this;
    } else {
        let result = [];
        selector.each(function () {
            result.push(this.getFieldValue(attrName));
        });
        return result;
    }

    function calculateValue(d, i) {
        let value = (typeof varOrFunc === 'function') ? varOrFunc(d, i) : varOrFunc;
        let convertedValue = converter(value);
        let element = this;
        if (isPrimitive(convertedValue)) {
            return convertedValue;
        } else {
            let fieldValue = element.getFieldValue(attrName);
            Object.keys(convertedValue).forEach((key) => fieldValue[key] = convertedValue[key]);
            return toString(fieldValue);
        }

        function isPrimitive(anything) {
            return Object(anything) !== anything;
        }
    }
}

function field(fieldSpec, varOrFunc) {

    let isString = (typeof fieldSpec === 'string');
    let path = isString ? fieldSpec : fieldSpec.path;
    let converter = isString ? _ => _ : fieldSpec.converter;

    let dotIndex = path.lastIndexOf(".");
    let selectorName = path.substr(0, dotIndex);
    let attrName = path.substr(dotIndex + 1, path.length);
    let selector = selectorName.length ? this.select(selectorName) : this;

    if (arguments.length === 2) {
        selector.each(setFieldValue);
        return this;
    } else {
        let result = [];
        selector.each(function () {
            result.push(this.getFieldValue(attrName));
        });
        return result;
    }

    function setFieldValue(d, i) {
        let value = (typeof varOrFunc === 'function') ? varOrFunc(d, i) : varOrFunc;
        let convertedValue = converter(value);
        let element = this;
        let fieldRef = element.requestFieldRef(attrName);
        if (!fieldRef || isPrimitive(convertedValue)) {
            element.setAttribute(attrName, convertedValue);
        } else {
            Object.keys(convertedValue).forEach((key) => fieldRef[key] = convertedValue[key]);
        }
        element.releaseFieldRef(attrName);

        function isPrimitive(anything) {
            return Object(anything) !== anything;
        }
    }
}


d3.transition.prototype.field = d3.selection.prototype.field = field;
d3.transition.prototype.attrdeep = d3.selection.prototype.attrdeep = attrdeep;

d3.transition.prototype.attr3d = d3.selection.prototype.attr3d = attr3d;

var utils = {
    encodePos,
    toTuple,
    toXyz,
    getColor,
    getTransparency,
    encodeColor
};

function encodeTuple(tuple) {
    return tuple.join(" ");
}

function toXyz(pos) {
    return Array.isArray(pos) ? {x: pos[0], y: pos[1], z: pos[2]} : pos;
}

function toTuple(pos) {
    return Array.isArray(pos) ? pos : [pos.x, pos.y, pos.z];
}

function encodePos(pos) {
    return encodeTuple(toTuple(pos));
}

function encodeColor(c) {
    return encodeTuple([c.r, c.g, c.b]);
}

var scale255 = d3.scaleLinear().domain([0, 255]).range([0, 1]);

function getColor(cssColor) {
    let color = d3.color(cssColor);
    return {
        r: scale255(color.r),
        g: scale255(color.g),
        b: scale255(color.b)
    };
}

function getTransparency(opacity) {
    return 1 - opacity;
}

group$1.position = {
    path: ".translation",
    converter: (pos) => utils.toXyz(pos),
    toString: (pos) => utils.encodePos(pos)
};

group$1.x = {
    path: ".translation",
    converter: (x) => {
        return {x}
    },
    toString: (pos) => utils.encodePos(pos)
};

group$1.y = {
    path: ".translation",
    converter: (y) => {
        return {y}
    },
    toString: (pos) => utils.encodePos(pos)
};

group$1.z = {
    path: ".translation",
    converter: (z) => {
        return {z}
    },
    toString: (pos) => utils.encodePos(pos)
};

function group$1() {
    let transform = document.createElement("transform");
    return transform;
}

Object.setPrototypeOf(shape$1, group$1);


shape$1.fill = {
    path: "shape appearance material.diffuseColor",
    converter: (c) => utils.getColor(c),
    toString: (c) => utils.encodeColor(c)
};

shape$1.opacity = {
    path: "shape appearance material.transparency",
    converter: (o) => utils.getTransparency(o)
};


function shape$1(tagName, onAdded) {
    let transform = group$1();
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

Object.setPrototypeOf(box$1, shape$1);

box$1.size = {
    path: "shape box.size",
    converter: (s) => utils.toXyz(s),
    toString: (s) => utils.encodePos(s)
};

box$1.width = {
    path: "shape box.size",
    converter: (x) => {
        return {x}
    },
    toString: (x) => utils.encodePos(x)
};

box$1.height = {
    path: "shape box.size",
    converter: (y) => {
        return {y}
    },
    toString: (y) => utils.encodePos(y)
};

box$1.depth = {
    path: "shape box.size",
    converter: (z) => {
        return {z}
    },
    toString: (z) => utils.encodePos(z)
};


function box$1() {
    return shape$1("box")
}

Object.setPrototypeOf(sphere$1, shape$1);

sphere$1.radius = {
    path: "shape sphere.radius",
    converter: (r) => r,
};

sphere$1.cx = shape$1.x;

sphere$1.cy = shape$1.y;

sphere$1.cz = shape$1.z;


function sphere$1() {
    return shape$1("sphere");
}

Object.setPrototypeOf(pyramid$1, shape$1);

pyramid$1.height = {
    path: "shape pyramid.height",
    converter: (h) => h,
};

pyramid$1.xbottom = pyramid$1.width = {
    path: "shape pyramid.xbottom",
    converter: (x) => x,
};

pyramid$1.ybottom = pyramid$1.depth = {
    path: "shape pyramid.ybottom",
    converter: (y) => y,
};

pyramid$1.xtop = {
    path: "shape pyramid.xtop",
    converter: (x) => x,
};

pyramid$1.ytop = {
    path: "shape pyramid.ytop",
    converter: (y) => y,
};

pyramid$1.xoff = {
    path: "shape pyramid.xoff",
    converter: (x) => x,
};

pyramid$1.yoff = {
    path: "shape pyramid.yoff",
    converter: (y) => y,
};

function pyramid$1() {
    return shape$1("pyramid");
}

Object.setPrototypeOf(cylinder$1, shape$1);

cylinder$1.height = {
    path: "shape cylinder.height",
    converter: (h) => h,
};

cylinder$1.radius = {
    path: "shape cylinder.radius",
    converter: (r) => r,
};

cylinder$1.width = cylinder$1.depth = {
    path: "shape cylinder.radius",
    converter: (w) => w / 2,
};

function cylinder$1() {
    return shape$1("cylinder");
}

Object.setPrototypeOf(cone$1, shape$1);

cone$1.height = {
    path: "shape cone.height",
    converter: (h) => h,
};

cone$1.radius = cone$1.bottomRadius = {
    path: "shape cone.bottomRadius",
    converter: (r) => r,
};

cone$1.bottomRadius = {
    path: "shape cone.topRadius",
    converter: (r) => r,
};

cone$1.width = cone$1.depth = {
    path: "shape cone.bottomRadius",
    converter: (w) => w / 2,
};

function cone$1() {
    return shape$1("cone");
}

Object.setPrototypeOf(line$1, shape$1);

line$1.stroke = {
    path: "shape appearance material.emissiveColor",
    converter: (c) => utils.getColor(c),
    toString: (c) => utils.encodeColor(c)
};

line$1.strokeOpacity = {
    path: "shape appearance material.transparency",
    converter: (o) => utils.getTransparency(o)
};

line$1.points = {
    path: "shape lineset coordinate.point",
    converter: (points) => points.map(utils.encodePos).join(" ")
};

function line$1() {

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

Object.setPrototypeOf(text$1, shape$1);

text$1.fontFamily = {
    path: "shape text fontstyle.family",
    converter: (f) => f,
};

text$1.fontSize = {
    path: "shape text fontstyle.size",
    converter: (s) => s,
};

text$1.fontJustify = {
    path: "shape text fontstyle.justify",
    converter: (j) => j,
};

text$1.fontQuality = {
    path: "shape text fontstyle.quality",
    converter: (q) => q,
};

text$1.text = {
    path: "shape text.string",
    converter: (q) => q,
};

function text$1() {
    let result = shape$1("text", (el) => {
        let fontstyle = document.createElement("fontstyle");
        el.appendChild(fontstyle);
    });
    result.setAttribute("solid", "true");
    return result;
}

div2d$1.position = {
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


function div2d$1() {
    var div = document.createElement("div");
    return div;
}

const dWhite = "rgba(255, 255, 255, 1)";
const dLightBlue = "rgba(130, 180, 255, 1)";
const palette = {
    sky: dWhite,
    ground: dWhite,
    object: dLightBlue,
};

function vis$2(parent) {
    return new Vis(parent);
}

function Vis(parent = "body") {

    this.x3 = d3
        .select(parent)
        .append("x3d")
        .style("height", "93%")
        .style("width", "100%")
        .style("border", "none");

    this.x3
        .append("background")
        .attr("groundColor", utils.getColor(palette.sky))
        .attr("skyColor", utils.getColor(palette.ground));

    this.scene = this.x3.append("scene");
    this.viewpoint = this.scene.append("viewpoint");
    //<navigationInfo id="navInfo" type='"EXAMINE" "ANY"' typeParams="-0.4, 60, 0.5, 1.55"></navigationInfo>
    this.scene.append("navigationInfo")
        .attr("id", "navInfo")
        .attr("type", '"EXAMINE" "ANY"')
        .attr("typeParams", "-0.4, 60, 0.5, 1.55");


    //https://examples.x3dom.org/example/x3dom_uiEvents.html
    var vis = this;
    document.onload = function () {
        vis.runtime = vis.x3.node().runtime;
        //d3.select('viewpoint').node().addEventListener('viewpointChanged', viewFunc, false);
    };

    return this;
}

Vis.prototype = vis$2.prototype = {
    setCenter: function (pos) {
        d3.select("viewpoint").attr("centerOfRotation", utils.encodePos(pos));
        return this;
    }
};

var center = function (x, y, z) {
    var nodes;

    if (x == null) x = 0;
    if (y == null) y = 0;
    if (z == null) z = 0;


    function force() {
        var i,
            n = nodes.length,
            node,
            sx = 0,
            sy = 0,
            sz = 0;

        for (i = 0; i < n; ++i) {
            node = nodes[i], sx += node.x, sy += node.y, sz += node.z;
        }

        for (sx = sx / n - x, sy = sy / n - y, sz = sz / n - z, i = 0; i < n; ++i) {
            node = nodes[i], node.x -= sx, node.y -= sy, node.z -= sz;
        }
    }

    force.initialize = function (_) {
        nodes = _;
    };

    force.x = function (_) {
        return arguments.length ? (x = +_, force): x;
    };

    force.y = function (_) {
        return arguments.length ? (y = +_, force): y;
    };

    force.z = function (_) {
        return arguments.length ? (z = +_, force): z;
    };

    return force;
};

var constant = function (x) {
    return function () {
        return x;
    };
};

var jiggle = function () {
    return (Math.random() - 0.5) * 1e-6;
};

var Oct = function (node, x0, y0, x1, y1) {
    this.node = node;
    this.x0 = x0;
    this.y0 = y0;
    this.x1 = x1;
    this.y1 = y1;
};

var tree_visit = function (callback) {
    var octs = [], q, node = this._root, child, x0, y0, x1, y1;
    if (node) octs.push(new Oct(node, this._x0, this._y0, this._x1, this._y1));
    while (q = octs.pop()) {
        if (!callback(node = q.node, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1) && node.length) {
            var xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            if (child = node[3]) octs.push(new Oct(child, xm, ym, x1, y1));
            if (child = node[2]) octs.push(new Oct(child, x0, ym, xm, y1));
            if (child = node[1]) octs.push(new Oct(child, xm, y0, x1, ym));
            if (child = node[0]) octs.push(new Oct(child, x0, y0, xm, ym));
        }
    }
    return this;
};

var tree_visitAfter = function (callback) {
    var octs = [], next = [], q;
    if (this._root) octs.push(new Oct(this._root, this._x0, this._y0, this._x1, this._y1));
    while (q = octs.pop()) {
        var node = q.node;
        if (node.length) {
            var child, x0 = q.x0, y0 = q.y0, x1 = q.x1, y1 = q.y1, xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
            if (child = node[0]) octs.push(new Oct(child, x0, y0, xm, ym));
            if (child = node[1]) octs.push(new Oct(child, xm, y0, x1, ym));
            if (child = node[2]) octs.push(new Oct(child, x0, ym, xm, y1));
            if (child = node[3]) octs.push(new Oct(child, xm, ym, x1, y1));
        }
        next.push(q);
    }
    while (q = next.pop()) {
        callback(q.node, q.x0, q.y0, q.x1, q.y1);
    }
    return this;
};

var tree_x = function (_) {
    return arguments.length ? (this._x = _, this) : this._x;
};

var tree_y = function (_) {
    return arguments.length ? (this._y = _, this) : this._y;
};

var tree_z = function (_) {
    return arguments.length ? (this._z = _, this) : this._z;
};

function octree(nodes, x, y, z) {
    var tree = new Octree(x == null ? defaultX : x, y == null ? defaultY : y, z == null ? defaultZ : z, NaN, NaN, NaN, NaN, NaN, NaN);
    return nodes == null ? tree : tree.addAll(nodes);
}

function Octree(x, y, z, x0, y0, z0, x1, y1, z1) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._x0 = x0;
    this._y0 = y0;
    this._z0 = z0;
    this._x1 = x1;
    this._y1 = y1;
    this._z1 = z1;
    this._root = undefined;
}

function leaf_copy(leaf) {
    var copy = {data: leaf.data}, next = copy;
    while (leaf = leaf.next) next = next.next = {data: leaf.data};
    return copy;
}

var treeProto = octree.prototype = Octree.prototype;

treeProto.copy = function () {
    var copy = new Octree(this._x, this._y, this._z, this._x0, this._y0, this._z0, this._x1, this._y1, this._z1),
        node = this._root,
        nodes,
        child;

    if (!node) return copy;

    if (!node.length) return copy._root = leaf_copy(node), copy;

    nodes = [{source: node, target: copy._root = new Array(8)}];
    while (node = nodes.pop()) {
        for (var i = 0; i < 8; ++i) {
            if (child = node.source[i]) {
                if (child.length) nodes.push({source: child, target: node.target[i] = new Array(8)});
                else node.target[i] = leaf_copy(child);
            }
        }
    }

    return copy;
};


function add(tree, x, y, z, d) {
    if (isNaN(x) || isNaN(y) || isNaN(z)) return tree; // ignore invalid points

    var parent,
        node = tree._root,
        leaf = {data: d},
        x0 = tree._x0,
        y0 = tree._y0,
        z0 = tree._z0,
        x1 = tree._x1,
        y1 = tree._y1,
        z1 = tree._z1,
        xm,
        ym,
        zm,
        xp,
        yp,
        zp,
        right,
        bottom,
        forward,
        i,
        j;

    // If the tree is empty, initialize the root as a leaf.
    if (!node) return tree._root = leaf, tree;

    // Find the existing leaf for the new point, or add it.
    while (node.length) {
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (forward = z >= (zm = (z0 + z1) / 2)) z0 = zm; else z1 = zm;

        if (parent = node, !(node = node[i = forward << 2 | bottom << 1 | right])) return parent[i] = leaf, tree;
    }

    // Is the new point is exactly coincident with the existing point?
    xp = +tree._x.call(null, node.data);
    yp = +tree._y.call(null, node.data);
    zp = +tree._z.call(null, node.data);
    if (x === xp && y === yp && z === zp) return leaf.next = node, parent ? parent[i] = leaf : tree._root = leaf, tree;

    // Otherwise, split the leaf node until the old and new point are separated.
    do {
        parent = parent ? parent[i] = new Array(8) : tree._root = new Array(8);
        if (right = x >= (xm = (x0 + x1) / 2)) x0 = xm; else x1 = xm;
        if (bottom = y >= (ym = (y0 + y1) / 2)) y0 = ym; else y1 = ym;
        if (forward = z >= (zm = (z0 + z1) / 2)) z0 = zm; else z1 = zm;
    } while ((i = forward << 2 | bottom << 1 | right) === (j = (zp >= zm) << 2 | (yp >= ym) << 1 | (xp >= xm)));
    return parent[j] = node, parent[i] = leaf, tree;
}

function addAll(data) {
    var d, i, n = data.length,
        x,
        y,
        z,
        xz = new Array(n),
        yz = new Array(n),
        zz = new Array(n),
        x0 = Infinity,
        y0 = Infinity,
        z0 = Infinity,
        x1 = -Infinity,
        y1 = -Infinity,
        z1 = -Infinity;

    // Compute the points and their extent.
    for (i = 0; i < n; ++i) {
        if (isNaN(x = +this._x.call(null, d = data[i])) || isNaN(y = +this._y.call(null, d)) || isNaN(z = +this._z.call(null, d))) continue;
        xz[i] = x;
        yz[i] = y;
        zz[i] = z;
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
        if (z < z0) z0 = z;
        if (z > z1) z1 = z;
    }

    // Expand the tree to cover the new points.
    //TODO Cover not impelemnted
    //this.cover(x0, y0).cover(x1, y1);
    fakeCover(this);
    function fakeCover(tree) {
        tree._x0 = x0;
        tree._y0 = y0;
        tree._x1 = x1;
        tree._y1 = y1;
    }

    // Add the new points.
    for (i = 0; i < n; ++i) {
        add(this, xz[i], yz[i], zz[i], data[i]);
    }

    return this;
}



// treeProto.add = tree_add;
treeProto.addAll = addAll;


// treeProto.cover = tree_cover;
// treeProto.data = tree_data;
// treeProto.extent = tree_extent;
// treeProto.find = tree_find;
// treeProto.remove = tree_remove;
// treeProto.removeAll = tree_removeAll;
// treeProto.root = tree_root;
// treeProto.size = tree_size;
treeProto.visit = tree_visit;
treeProto.visitAfter = tree_visitAfter;
treeProto.x = tree_x;
treeProto.y = tree_y;
treeProto.z = tree_z;

function x(d) {
    return d.x + d.vx;
}

function y(d) {
    return d.y + d.vy;
}

function z(d) {
    return d.z + d.vz;
}

var collide = function (radius) {
    var nodes,
        radii,
        strength = 1,
        iterations = 1;

    if (typeof radius !== "function") radius = constant(radius == null ? 1 : +radius);

    function force() {
        var i, n = nodes.length,
            tree,
            node,
            xi,
            yi,
            zi,
            ri,
            ri2;

        for (var k = 0; k < iterations; ++k) {
            tree = octree(nodes, x, y, z).visitAfter(prepare);
            for (i = 0; i < n; ++i) {
                node = nodes[i];
                ri = radii[node.index], ri2 = ri * ri;
                xi = node.x + node.vx;
                yi = node.y + node.vy;
                zi = node.z + node.vz;
                tree.visit(apply);
            }
        }

        function apply(oct, x0, y0, z0, x1, y1, z1) {
            var data = oct.data, rj = oct.r, r = ri + rj;
            if (data) {
                if (data.index < node.index) {
                    var x = xi - data.x - data.vx,
                        y = yi - data.y - data.vy,
                        z = zi - data.z - data.vz,
                        l = x * x + y * y + z * z;
                    if (l < r * r) {
                        if (x === 0) x = jiggle(), l += x * x;
                        if (y === 0) y = jiggle(), l += y * y;
                        if (z === 0) z = jiggle(), l += z * z;

                        l = (r - (l = Math.sqrt(l))) / l * strength;
                        node.vx += (x *= l) * (r = (rj *= rj) / (ri2 + rj));
                        node.vy += (y *= l) * r;
                        node.vz += (z *= l) * r;
                        data.vx -= x * (r = 1 - r);
                        data.vy -= y * r;
                        data.vz -= z * r;
                    }
                }
                return;
            }
            return x0 > xi + r || x1 < xi - r || y0 > yi + r || y1 < yi - r || z0 > zi + r || z1 < zi - r;
        }
    }

    function prepare(oct) {
        if (oct.data) return oct.r = radii[oct.data.index];
        for (var i = oct.r = 0; i < 8; ++i) {
            if (oct[i] && oct[i].r > oct.r) {
                oct.r = oct[i].r;
            }
        }
    }

    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        radii = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], radii[node.index] = +radius(node, i, nodes);
    }

    force.initialize = function (_) {
        nodes = _;
        initialize();
    };

    force.iterations = function (_) {
        return arguments.length ? (iterations = +_, force): iterations;
    };

    force.strength = function (_) {
        return arguments.length ? (strength = +_, force): strength;
    };

    force.radius = function (_) {
        return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), initialize(), force) : radius;
    };

    return force;
};

let map = d3.map;

function index(d) {
    return d.index;
}

function find(nodeById, nodeId) {
    var node = nodeById.get(nodeId);
    if (!node) throw new Error("missing: " + nodeId);
    return node;
}

var link = function (links) {
    var id = index,
        strength = defaultStrength,
        strengths,
        distance = constant(30),
        distances,
        nodes,
        count,
        bias,
        iterations = 1;

    if (links == null) links = [];

    function defaultStrength(link) {
        return 1 / Math.min(count[link.source.index], count[link.target.index]);
    }

    function force(alpha) {
        for (var k = 0, n = links.length; k < iterations; ++k) {
            for (var i = 0, link, source, target, x, y, z, l, b; i < n; ++i) {
                link = links[i], source = link.source, target = link.target;
                x = target.x + target.vx - source.x - source.vx || jiggle();
                y = target.y + target.vy - source.y - source.vy || jiggle();
                z = target.z + target.vz - source.z - source.vz || jiggle();

                l = Math.sqrt(x * x + y * y + z * z);
                l = (l - distances[i]) / l * alpha * strengths[i];
                x *= l, y *= l, z *= l;
                target.vx -= x * (b = bias[i]);
                target.vy -= y * b;
                target.vz -= z * b;

                source.vx += x * (b = 1 - b);
                source.vy += y * b;
                source.vz += z * b;
            }
        }
    }

    function initialize() {
        if (!nodes) return;

        var i,
            n = nodes.length,
            m = links.length,
            nodeById = map(nodes, id),
            link;

        for (i = 0, count = new Array(n); i < m; ++i) {
            link = links[i], link.index = i;
            if (typeof link.source !== "object") link.source = find(nodeById, link.source);
            if (typeof link.target !== "object") link.target = find(nodeById, link.target);
            count[link.source.index] = (count[link.source.index] || 0) + 1;
            count[link.target.index] = (count[link.target.index] || 0) + 1;
        }

        for (i = 0, bias = new Array(m); i < m; ++i) {
            link = links[i], bias[i] = count[link.source.index] / (count[link.source.index] + count[link.target.index]);
        }

        strengths = new Array(m), initializeStrength();
        distances = new Array(m), initializeDistance();
    }

    function initializeStrength() {
        if (!nodes) return;

        for (var i = 0, n = links.length; i < n; ++i) {
            strengths[i] = +strength(links[i], i, links);
        }
    }

    function initializeDistance() {
        if (!nodes) return;

        for (var i = 0, n = links.length; i < n; ++i) {
            distances[i] = +distance(links[i], i, links);
        }
    }

    force.initialize = function (_) {
        nodes = _;
        initialize();
    };

    force.links = function (_) {
        return arguments.length ? (links = _, initialize(), force) : links;
    };

    force.id = function (_) {
        return arguments.length ? (id = _, force): id;
    };

    force.iterations = function (_) {
        return arguments.length ? (iterations = +_, force): iterations;
    };

    force.strength = function (_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initializeStrength(), force) : strength;
    };

    force.distance = function (_) {
        return arguments.length ? (distance = typeof _ === "function" ? _ : constant(+_), initializeDistance(), force) : distance;
    };

    return force;
};

let dispatch = d3.dispatch;
let map$1 = d3.map;
let timer = d3.timer;

function x$1(d) {
    return d.x;
}

function y$1(d) {
    return d.y;
}

function z$1(d) {
    return d.z;
}

var initialRadius = 10;
var initialAngle = Math.PI * (3 - Math.sqrt(5));

var simulation = function (nodes) {
    var simulation,
        alpha = 1,
        alphaMin = 0.01,
        alphaDecay = 1 - Math.pow(alphaMin, 1 / 300),
        alphaTarget = 0.1,
        velocityDecay = 0.6,
        forces = map$1(),
        stepper = timer(step),
        event = dispatch("tick", "end");

    if (nodes == null) nodes = [];

    function step() {
        tick();
        event.call("tick", simulation);
        if (alpha < alphaMin) {
            stepper.stop();
            event.call("end", simulation);
        }
    }

    function tick() {
        var i, n = nodes.length, node;

        alpha += (alphaTarget - alpha) * alphaDecay;

        forces.each(function (force) {
            force(alpha);
        });

        for (i = 0; i < n; ++i) {
            node = nodes[i];
            if (node.fx == null) node.x += node.vx *= velocityDecay;
            else node.x = node.fx, node.vx = 0;
            if (node.fy == null) node.y += node.vy *= velocityDecay;
            else node.y = node.fy, node.vy = 0;
            if (node.fz == null) node.z += node.vz *= velocityDecay;
            else node.z = node.fz, node.vz = 0;
        }
    }

    function initializeNodes() {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
            node = nodes[i], node.index = i;
            if (isNaN(node.x) || isNaN(node.y) || isNaN(node.y)) {
                var radius = initialRadius * Math.sqrt(i), angle = i * initialAngle;
                node.x = radius * Math.cos(angle);
                node.y = radius * Math.sin(angle);
                //TODO: Adapt initial distribution to 3D
                node.z = radius * Math.sin(angle * 7);
            }
            if (isNaN(node.vx) || isNaN(node.vy) || isNaN(node.vz)) {
                node.vx = node.vy = node.vz = 0;
            }
        }
    }

    function initializeForce(force) {
        if (force.initialize) force.initialize(nodes);
        return force;
    }

    initializeNodes();

    return simulation = {
        tick: tick,

        restart: function () {
            return stepper.restart(step), simulation;
        },

        stop: function () {
            return stepper.stop(), simulation;
        },

        nodes: function (_) {
            return arguments.length ? (nodes = _, initializeNodes(), forces.each(initializeForce), simulation) : nodes;
        },

        alpha: function (_) {
            return arguments.length ? (alpha = +_, simulation): alpha;
        },

        alphaMin: function (_) {
            return arguments.length ? (alphaMin = +_, simulation): alphaMin;
        },

        alphaDecay: function (_) {
            return arguments.length ? (alphaDecay = +_, simulation) : +alphaDecay;
        },

        alphaTarget: function (_) {
            return arguments.length ? (alphaTarget = +_, simulation): alphaTarget;
        },

        velocityDecay: function (_) {
            return arguments.length ? (velocityDecay = 1 - _, simulation): 1 -velocityDecay;
        },

        force: function (name, _) {
            return arguments.length > 1 ? ((_ == null ? forces.remove(name) : forces.set(name, initializeForce(_))), simulation) : forces.get(name);
        },

        find: function (x, y, z, radius) {
            var i = 0,
                n = nodes.length,
                dx,
                dy,
                dz,
                d2,
                node,
                closest;

            if (radius == null) radius = Infinity;
            else radius *= radius;

            for (i = 0; i < n; ++i) {
                node = nodes[i];
                dx = x - node.x;
                dy = y - node.y;
                dz = z - node.z;
                d2 = dx * dx + dy * dy + dz * dz;
                if (d2 < radius) closest = node, radius = d2;
            }

            return closest;
        },

        on: function (name, _) {
            return arguments.length > 1 ? (event.on(name, _), simulation) : event.on(name);
        }
    };
};

var manyBody = function () {
    var nodes,
        node,
        alpha,
        strength = constant(-30),
        strengths,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;

    function force(_) {
        var i, n = nodes.length, tree = octree(nodes, x$1, y$1, z$1).visitAfter(accumulate);
        for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }

    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        strengths = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
    }

    function accumulate(oct) {
        var strength = 0, q, c, x$$1, y$$1, z$$1, i;

        // For internal nodes, accumulate forces from child octrants.
        if (oct.length) {
            for (x$$1 = y$$1 = z$$1 = i = 0; i < 8; ++i) {
                if ((q = oct[i]) && (c = q.value)) {
                    strength += c;
                    x$$1 += c * q.x;
                    y$$1 += c * q.y;
                    z$$1 += c * q.z;
                }
            }
            oct.x = x$$1 / strength;
            oct.y = y$$1 / strength;
            oct.z = z$$1 / strength;
        }

        // For leaf nodes, accumulate forces from coincident octrants.
        else {
            q = oct;
            q.x = q.data.x;
            q.y = q.data.y;
            q.z = q.data.z;
            do strength += strengths[q.data.index];
            while (q = q.next);
        }

        oct.value = strength;
    }

    function apply(oct, x1, _, x2) {
        if (!oct.value) return true;

        var x$$1 = oct.x - node.x,
            y$$1 = oct.y - node.y,
            z$$1 = oct.z - node.z,
            w = x2 - x1,
            l = x$$1 * x$$1 + y$$1 * y$$1 + z$$1 * z$$1;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
            if (l < distanceMax2) {
                if (x$$1 === 0) x$$1 = jiggle(), l += x$$1 * x$$1;
                if (y$$1 === 0) y$$1 = jiggle(), l += y$$1 * y$$1;
                if (z$$1 === 0) z$$1 = jiggle(), l += z$$1 * z$$1;
                if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
                node.vx += x$$1 * oct.value * alpha / l;
                node.vy += y$$1 * oct.value * alpha / l;
                node.vz += z$$1 * oct.value * alpha / l;
            }
            return true;
        }

        // Otherwise, process points directly.
        else if (oct.length || l >= distanceMax2) return;

        // Limit forces for very close nodes; randomize direction if coincident.
        if (oct.data !== node || oct.next) {
            if (x$$1 === 0) x$$1 = jiggle(), l += x$$1 * x$$1;
            if (y$$1 === 0) y$$1 = jiggle(), l += y$$1 * y$$1;
            if (z$$1 === 0) z$$1 = jiggle(), l += z$$1 * z$$1;
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        }

        do if (oct.data !== node) {
            w = strengths[oct.data.index] * alpha / l;
            node.vx += x$$1 * w;
            node.vy += y$$1 * w;
            node.vz += z$$1 * w;
        } while (oct = oct.next);
    }

    force.initialize = function (_) {
        nodes = _;
        initialize();
    };

    force.strength = function (_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.distanceMin = function (_) {
        return arguments.length ? (distanceMin2 = _ * _, force): Math.sqrt(distanceMin2);
    };

    force.distanceMax = function (_) {
        return arguments.length ? (distanceMax2 = _ * _, force): Math.sqrt(distanceMax2);
    };

    force.theta = function (_) {
        return arguments.length ? (theta2 = _ * _, force): Math.sqrt(theta2);
    };

    return force;
};

var x$2 = function (x) {
    var strength = constant(0.1),
        nodes,
        strengths,
        xz;

    if (typeof x !== "function") x = constant(x == null ? 0 : +x);

    function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
            node = nodes[i], node.vx += (xz[i] - node.x) * strengths[i] * alpha;
        }
    }

    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        xz = new Array(n);
        for (i = 0; i < n; ++i) {
            strengths[i] = isNaN(xz[i] = +x(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
    }

    force.initialize = function (_) {
        nodes = _;
        initialize();
    };

    force.strength = function (_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.x = function (_) {
        return arguments.length ? (x = typeof _ === "function" ? _ : constant(+_), initialize(), force) : x;
    };

    return force;
};

var y$2 = function (y) {
    var strength = constant(0.1),
        nodes,
        strengths,
        yz;

    if (typeof y !== "function") y = constant(y == null ? 0 : +y);

    function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
            node = nodes[i], node.vy += (yz[i] - node.y) * strengths[i] * alpha;
        }
    }

    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        yz = new Array(n);
        for (i = 0; i < n; ++i) {
            strengths[i] = isNaN(yz[i] = +y(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
    }

    force.initialize = function (_) {
        nodes = _;
        initialize();
    };

    force.strength = function (_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.y = function (_) {
        return arguments.length ? (y = typeof _ === "function" ? _ : constant(+_), initialize(), force) : y;
    };

    return force;
};

var z$2 = function (z) {
    var strength = constant(0.1),
        nodes,
        strengths,
        zz;

    if (typeof z !== "function") z = constant(z == null ? 0 : +z);

    function force(alpha) {
        for (var i = 0, n = nodes.length, node; i < n; ++i) {
            node = nodes[i], node.vz += (zz[i] - node.z) * strengths[i] * alpha;
        }
    }

    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length;
        strengths = new Array(n);
        zz = new Array(n);
        for (i = 0; i < n; ++i) {
            strengths[i] = isNaN(zz[i] = +z(nodes[i], i, nodes)) ? 0 : +strength(nodes[i], i, nodes);
        }
    }

    force.initialize = function (_) {
        nodes = _;
        initialize();
    };

    force.strength = function (_) {
        return arguments.length ? (strength = typeof _ === "function" ? _ : constant(+_), initialize(), force) : strength;
    };

    force.z = function (_) {
        return arguments.length ? (z = typeof _ === "function" ? _ : constant(+_), initialize(), force) : z;
    };

    return force;
};

var constant$1 = function (x) {
    return function () {
        return x;
    };
};

function DragEvent(target, type, x, y, z, dx, dy, dz) {
    this.target = target;
    this.type = type;
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
}

DragEvent.prototype.on = function () {
    var value = this._.on.apply(this._, arguments);
    return value === this._ ? this : value;
};

/* global d3:true */
/* global xyz4d3:true */

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
    return !event.button;
}

function defaultContainer() {
    return this.parentNode;
}

function defaultSubject(d) {
    return d == null ? {x: event.x, y: event.y} : d;
}

var drag = function () {
    var filter = defaultFilter,
        container = defaultContainer,
        subject = defaultSubject,
        listeners = d3.dispatch("start", "drag", "end"),
        clickDistance2 = 0;

    function drag(selection) {
        var result = selection
            .on("mousedown", mousedowned)
            //            .on("mouseup", mouseupped)
            .on("mousemove", mousemoved)
            .on("mouseout", mousemoved);


        //TODO: subscribe after drag start and later unsubscribe.


        document.addEventListener("mousemove", mousemoved);
        document.addEventListener("mouseenter", mousemoved);
        document.addEventListener("mouseup", mouseupped);

        return result;
    }

    function mousedowned(dd) {
        d = dd;
        if (!filter.apply(this, arguments)) return;

        start3DDrag(this);
        let pos = pos3D;
        xyz4d3.event = new DragEvent(this, "start", pos.x, pos.y, pos.z, 0, 0, 0);
        listeners.call("start", this, d);
        lastMouseX = event.offsetX;
        lastMouseY = event.offsetY;
    }

    var lastMouseX, lastMouseY;
    lastMouseX = lastMouseY = -1;

    function mousemoved() {
        if (!draggedNode) return;

        let prev = pos3D;


        if (lastMouseX === -1) {
            lastMouseX = event.offsetX;
        }
        if (lastMouseY === -1) {
            lastMouseY = event.offsetY;
        }


        let pos = change3DPos(event.offsetX - lastMouseX, event.offsetY - lastMouseY);

        lastMouseX = event.offsetX;
        lastMouseY = event.offsetY;

        xyz4d3.event = new DragEvent(this, "drag", pos.x, pos.y, pos.z, prev.x - pos.x, prev.y - pos.y, prev.z - pos.z);
        listeners.call("drag", this, d);
    }

    function mouseupped() {
        if (!draggedNode) return;

        if (!filter.apply(this, arguments)) return;
        let pos = pos3D;
        xyz4d3.event = new DragEvent(this, "end", pos.x, pos.y, pos.z, 0, 0, 0);
        stop3DDrag();
        listeners.call("end", this, d);
    }

    var d = null;

    var draggedNode = null;

    //vectors in 3D world space, associated to mouse x/y movement on the screen
    var upVec = null;
    var rightVec = null;

    var pos3D = null;


    function start3DDrag(element) {

        //disable navigation during dragging
        //TODO This is a secret knowlage
        document.getElementById("navInfo").setAttribute("type", '"NONE"');

        draggedNode = element;
        pos3D = new x3dom.fields.SFVec3f.parse(element.getAttribute("translation"));

        //compute the dragging vectors in world coordinates
        //(since navigation is disabled, those will not change until dragging has been finished)

        //get the viewer's 3D local frame
        var x3d = d3.select("x3d").node();
        let runtime = x3d.runtime;
        var vMatInv = runtime.viewMatrix().inverse();
        var viewDir = vMatInv.multMatrixVec(new x3dom.fields.SFVec3f(0.0, 0.0, -1.0));

        //use the viewer's up-vector and right-vector
        upVec = vMatInv.multMatrixVec(new x3dom.fields.SFVec3f(0.0, 1.0, 0.0));
        rightVec = viewDir.cross(upVec);

        //project a world unit to the screen to get its size in pixels
        var p1 = runtime.calcCanvasPos(pos3D.x, pos3D.y, pos3D.z);
        var p2 = runtime.calcCanvasPos(pos3D.x + rightVec.x, pos3D.y + rightVec.y, pos3D.z + rightVec.z);
        var magnificationFactor = 1.0 / Math.abs(p1[0] - p2[0]);

        //scale up vector and right vector accordingly
        upVec = upVec.multiply(magnificationFactor);
        rightVec = rightVec.multiply(magnificationFactor);
    }

    function change3DPos(dx, dy) {
        //scale up vector and right vector accordingly
        var offsetUp = upVec.multiply(-dy);
        var offsetRight = rightVec.multiply(dx);

        pos3D = pos3D.add(offsetUp).add(offsetRight);
        return pos3D;
    }

    function stop3DDrag() {

        draggedNode = null;
        upVec = null;
        rightVec = null;
        pos3D = null;

        //TODO This is a secret knowlage
        //re-enable navigation after dragging
        document.getElementById("navInfo").setAttribute("type", '"EXAMINE" "ANY"');
    }


    drag.filter = function (_) {
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), drag): filter;
    };

    drag.container = function (_) {
        return arguments.length ? (container = typeof _ === "function" ? _ : constant$1(_), drag): container;
    };

    drag.subject = function (_) {
        return arguments.length ? (subject = typeof _ === "function" ? _ : constant$1(_), drag): subject;
    };

    drag.on = function () {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? drag : value;
    };

    drag.clickDistance = function (_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, drag): Math.sqrt(clickDistance2);
    };

    return drag;
};

exports.group = group$1;
exports.shape = shape$1;
exports.box = box$1;
exports.sphere = sphere$1;
exports.pyramid = pyramid$1;
exports.cylinder = cylinder$1;
exports.cone = cone$1;
exports.line = line$1;
exports.text = text$1;
exports.div2d = div2d$1;
exports.utils = utils;
exports.vis = vis$2;
exports.forceCenter = center;
exports.forceCollide = collide;
exports.forceLink = link;
exports.forceManyBody = manyBody;
exports.forceSimulation = simulation;
exports.forceX = x$2;
exports.forceY = y$2;
exports.forceZ = z$2;
exports.drag = drag;

Object.defineProperty(exports, '__esModule', { value: true });

})));
