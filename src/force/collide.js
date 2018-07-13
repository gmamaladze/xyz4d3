import constant from "./constant";
import jiggle from "./jiggle";
import octree from "../datastructures/octree";

function x(d) {
    return d.x + d.vx;
}

function y(d) {
    return d.y + d.vy;
}

function z(d) {
    return d.z + d.vz;
}

export default function (radius) {
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
}
