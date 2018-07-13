'use strict';
import palette from "./palette.js";
import utils from "./utils.js";

/* global d3:true */
/* global document:true */

export default vis;

function vis(parent) {
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

Vis.prototype = vis.prototype = {
    setCenter: function (pos) {
        d3.select("viewpoint").attr("centerOfRotation", utils.encodePos(pos));
        return this;
    }
};
