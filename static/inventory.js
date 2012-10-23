// see if we have a manufacturer in manufacturer-text, try to populate
// "make-text"
function decode_vin () {
    COPACETIC.connect(
            window.location.protocol + "//" + window.location.host + "/inventory/decode/" + document.getElementById("vin-text").value,
            "",
            fetch_vin_data);
}

// write vin data to page
function fetch_vin_data (XML) {
    var json = XML.responseText;
    var res = JSON.parse(json);
    // todo warning message to right
    clear_errors();
    if (res.error === undefined) {
        document.getElementById("make-text").value = res[0].manufacturer;
        document.getElementById("year-text").value = res[0].year;
        document.getElementById("model-text").value = res[0].model;
    } else {
        document.getElementById("errors").appendChild(document.createTextNode(res.error));
    }
}

function clear_errors () {
    if (document.getElementById("errors").childNodes.length > 0){
        document.getElementById("errors").removeChild(document.getElementById("errors").childNodes[0]);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    // attempt to extract useful data from VIN number, if it exists
    document.getElementById("vin-text").addEventListener("change", decode_vin, false);
    document.getElementById("decode-vin").addEventListener("click", decode_vin, false);

}, false);
