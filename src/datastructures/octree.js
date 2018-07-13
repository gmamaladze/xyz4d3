import tree_visit from "./visit";
import tree_visitAfter from "./visitAfter";
import tree_x from "./x";
import tree_y from "./y";
import tree_z from "./z";


export default function octree(nodes, x, y, z) {
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

export function addAll(data) {
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