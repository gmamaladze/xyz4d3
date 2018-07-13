import constant from "./constant";
import jiggle from "./jiggle";
import octree from "../datastructures/octree";
import {x, y, z} from "./simulation";

export default function () {
    var nodes,
        node,
        alpha,
        strength = constant(-30),
        strengths,
        distanceMin2 = 1,
        distanceMax2 = Infinity,
        theta2 = 0.81;

    function force(_) {
        var i, n = nodes.length, tree = octree(nodes, x, y, z).visitAfter(accumulate);
        for (alpha = _, i = 0; i < n; ++i) node = nodes[i], tree.visit(apply);
    }

    function initialize() {
        if (!nodes) return;
        var i, n = nodes.length, node;
        strengths = new Array(n);
        for (i = 0; i < n; ++i) node = nodes[i], strengths[node.index] = +strength(node, i, nodes);
    }

    function accumulate(oct) {
        var strength = 0, q, c, x, y, z, i;

        // For internal nodes, accumulate forces from child octrants.
        if (oct.length) {
            for (x = y = z = i = 0; i < 8; ++i) {
                if ((q = oct[i]) && (c = q.value)) {
                    strength += c;
                    x += c * q.x;
                    y += c * q.y;
                    z += c * q.z;
                }
            }
            oct.x = x / strength;
            oct.y = y / strength;
            oct.z = z / strength;
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

        var x = oct.x - node.x,
            y = oct.y - node.y,
            z = oct.z - node.z,
            w = x2 - x1,
            l = x * x + y * y + z * z;

        // Apply the Barnes-Hut approximation if possible.
        // Limit forces for very close nodes; randomize direction if coincident.
        if (w * w / theta2 < l) {
            if (l < distanceMax2) {
                if (x === 0) x = jiggle(), l += x * x;
                if (y === 0) y = jiggle(), l += y * y;
                if (z === 0) z = jiggle(), l += z * z;
                if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
                node.vx += x * oct.value * alpha / l;
                node.vy += y * oct.value * alpha / l;
                node.vz += z * oct.value * alpha / l;
            }
            return true;
        }

        // Otherwise, process points directly.
        else if (oct.length || l >= distanceMax2) return;

        // Limit forces for very close nodes; randomize direction if coincident.
        if (oct.data !== node || oct.next) {
            if (x === 0) x = jiggle(), l += x * x;
            if (y === 0) y = jiggle(), l += y * y;
            if (z === 0) z = jiggle(), l += z * z;
            if (l < distanceMin2) l = Math.sqrt(distanceMin2 * l);
        }

        do if (oct.data !== node) {
            w = strengths[oct.data.index] * alpha / l;
            node.vx += x * w;
            node.vy += y * w;
            node.vz += z * w;
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
}
