"use strict";

var Util = {}

Util.getEl = function(input) {
    return document.querySelectorAll(input)
}


if (window.addEventListener) {

    Util.addLis = function(ele, event, func) {
        ele.addEventListener(event, func, false);
    };

    Util.stProp = function(event) {
        event.stopPropagation();
    };
    Util.prDef = function(event) {
        event.preventDefault();
    };
    Util.remLis = function(ele, event, func) {
        ele.removeEventListener(event, func, false);
    };

}

if (window.attachEvent) {
    Util.addLis = function(ele, event, func) {
        ele.attachEvent("on" + type, listener2);
    };

    Util.stProp = function(event) {
        event.cancelBubble = true;
    };

    Util.prDef = function(event) {
        event.returnValue = false;
    };

    Util.remLis = function(ele, event, func) {
        ele.detachEvent(event, func);
    };

}


console.log(Util.getEl('input'));