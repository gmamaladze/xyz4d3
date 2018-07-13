'use strict'

/* global d3:true */

export default function () {

    let vpadding = 20;
    let pack = d3.pack();

    function tree3d(root) {

        pack(root);
        let radius = pack.radius()();
        let yscale = d3.scaleLinear().domain([0, root.height]).range([0, (vpadding + 2 * radius) * root.height]);

        root.each((n) => {
            n.z = n.y;
            n.y = yscale(n.depth);
        })
        return root;
    }

    tree3d.radius = function (r) {
        return arguments.length ? (pack.radius(r), tree3d) : pack.radius();
    }

    tree3d.hpadding = function (p) {
        return arguments.length ? (pack.padding(p), tree3d) : pack.padding();
    }

    tree3d.vpadding = function (x) {
        return arguments.length ? ( (vpadding = x ), tree3d) : vpadding;
    };

    return tree3d;
}