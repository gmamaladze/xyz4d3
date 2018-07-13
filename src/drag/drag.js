/* global d3:true */
/* global xyz4d3:true */

import constant from "./constant";
import DragEvent from "./event";

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

export default function () {
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
        return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag): filter;
    };

    drag.container = function (_) {
        return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag): container;
    };

    drag.subject = function (_) {
        return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag): subject;
    };

    drag.on = function () {
        var value = listeners.on.apply(listeners, arguments);
        return value === listeners ? drag : value;
    };

    drag.clickDistance = function (_) {
        return arguments.length ? (clickDistance2 = (_ = +_) * _, drag): Math.sqrt(clickDistance2);
    };

    return drag;
}
