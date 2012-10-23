var color_table = [
    "#008000", // green
    "#FFFF00", // yellow
    "#0000FF", // blue
    "#FFA500", // orange
    "#8D38C9", // violet
    "#FF0000", // red
    "#00FFFF", // cyan
    "#000000",] // black

function find_tds () {
    var tds = document.getElementsByTagName("td");
    var i;
    for (i = 0; i < tds.length; i = i + 1) {
        alter_background(tds[i]);
    }
}

function alter_background (node) {
    var txt = node.childNodes[0].nodeValue;

    if (txt.length !== 1) {
        return ;
    }

    if (parseInt(txt) === NaN) {
        return ;
    }

    node.style.background = color_table[parseInt(txt) -1];
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    find_tds();
}, false);
