'use strict';
/* global d3:true */

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
};


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
};


d3.transition.prototype.field = d3.selection.prototype.field = field;
d3.transition.prototype.attrdeep = d3.selection.prototype.attrdeep = attrdeep;

d3.transition.prototype.attr3d = d3.selection.prototype.attr3d = attr3d;
