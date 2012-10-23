// TODO: clean up nomenclature vis. Brand/Make

function extract_vin (vin) {
    var vin_rexp = new RegExp("[ABCDEFGHJKLMNPRSTUVWXYZ0123456789]{8}[ABCDEFGHJKLMNPRSTUVWXYZ0123456789][ABCDEFGHJKLMNPRSTVWXY123456789][ABCDEFGHJKLMNPRSTUVWXYZ0123456789]{4}[0-9]{3}", "i");
    if (vin_rexp.exec(vin) != null) {
        return vin_rexp.exec(vin)[0].toUpperCase();
    }
    return null;
}

// if we have a vin value coming in on location, start the process
// otherwise, wait until a vin is entered into vin-text
function populate_vin () {
    var vin = document.getElementById("vin-text").value;

    if (vin === "") {
        vin = location.search;
    }

    var vin = extract_vin(vin);
    if (vin !== null) {
        document.getElementById("vin-text").value = vin;
        vehicle_cv();
    }
}

// decode the vehicle as best you can from vin
function vehicle_cv () {
    var vin = document.getElementById("vin-text").value;
    if (vin !== null) {
        COPACETIC.connect(
                window.location.protocol + "//" + window.location.host + "/vin/decode/" + vin,
                "",
                vin_breakdown);
   }
}

// if we have a manufacturer, pre-populate, else give us a list.
function manufacturer_helper (a) {
    // anything determined earlier must go

    document.getElementById("manufacturer-text").value = "";
    document.getElementById("make-text").value = "";
    document.getElementById("db-brand-id").value = "";

    if (a.length === 0) {
        return;
    }

    if (a.length === 1) {
        document.getElementById("manufacturer-text").value = a[0];
        // see if we have a brand to populate the make values
        query_brand();
        return;
    }
    // more than one manufacturer for this code, make a list.
    manufacturer_list(a);
}

// see if we have a manufacturer in manufacturer-text, try to populate
// "make-text"
function query_brand () {
    var manu = document.getElementById("manufacturer-text").value;
    if (manu !== null) {
        COPACETIC.connect(
                window.location.protocol + "//" + window.location.host + "/vin/brands?manufacturer=" + manu,
                "",
             fetch_brand);
   }
}

// fetch the brand from db, populate make-text and db-brand
function fetch_brand (XML) {
    var json = XML.responseText;
    var res = JSON.parse(json);
    if (res.brand !== null) {
        document.getElementById("make-text").value = res.brand;
        document.getElementById("db-brand-id").value = res.brand;
    }
}

// create clickable list of manufacturers, displays beneath manufacturer
// text box
function manufacturer_list (a) {
    if (document.getElementById("manufacturer-choices")) {
        return;
    }

    if (document.getElementById("oopsbutton")) {
        return;
    }

    var i, container = document.createElement("div");
    container.setAttribute("id", "manufacturer-choices");

    for (i = 0; i < a.length; i = i + 1) {
        container.appendChild(manufacturer_choice(a[i]));
    }
    document.getElementById("manufacturer-div").appendChild(container);
}

// clickable (span) choice for manufacturer_list
function manufacturer_choice (manufacturer) {

    var choice = document.createElement("span");
    choice.setAttribute("id", manufacturer);
    choice.setAttribute("class", "choice");
    choice.onclick = function () {
        document.getElementById("manufacturer-text").value = manufacturer;
        // oops! show the choices again
        oops_button(choice.parentNode.parentNode);
        // remove the parent div
        choice.parentNode.parentNode.removeChild(choice.parentNode);
        // try to populate the brand.
        query_brand();
    };

    choice.onmouseover = function () {
        choice.style.background="#ccffff";
        choice.style.border = "dashed black 1px";
    }

    choice.onmouseout = function () {
        choice.style.background="white";
        choice.style.border = "solid white 1px";
    }

    choice.appendChild(document.createTextNode(manufacturer));
    return choice;
}

// create a (show choices) link to re-display the manufacturer choices
function oops_button(node) {
    if (document.getElementById("oopsbutton")) {
        return;
    }
    var oops = document.createElement("span");
    node.appendChild(oops);
    oops.setAttribute("id", "oopsbutton");
    oops.setAttribute("class", "oops");
    oops.appendChild(document.createTextNode("(show choices)"));
    oops.onclick = function () {
        populate_vin();
        oops.parentNode.removeChild(oops);
    }
}

// remove existing vinerr
function dismiss_vinerr () {
    if (document.getElementById("vinerr")) {
        document.getElementById("vinerr").parentNode.removeChild(document.getElementById("vinerr"));
    }
}

// change the displacement type roll-style when clicked
function roll_displacement () {
    var dl = document.getElementById("displacement-list").value.split(",");
    dl.push(dl[0]);
    dl.splice(0,1);
    document.getElementById("displacement-list").value = dl.join();
    document.getElementById("cc").childNodes[0].nodeValue=dl[0];
    document.getElementById("displacement-type-id").value=dl[0];
}

// get vin information from mc
function vin_breakdown (XML) {
    var json = XML.responseText;
    var res = JSON.parse(json);
    var vinerr;

    dismiss_vinerr();
    if (res.origin !== null) {
        document.getElementById("origin-text").value = res.origin;
    }

    if (res.year !== null) {
        document.getElementById("year-text").value = res.year;
    }

    manufacturer_helper(res.manufacturer);

    if (res.checksum === false) {
        vinerr = document.createElement("span");
        vinerr.appendChild(document.createTextNode("Caution: PLEASE DOUBLE-CHECK your VIN! " + VIN.extract_vin() + " does not have a valid check digit. Not all manufacturers/countries use a check digit, so this may be okay.")); 
        vinerr.setAttribute("class", "alert");
        vinerr.setAttribute("id", "vinerr");
        document.getElementById("vin-frame-number").appendChild(vinerr);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    // attempt to extract useful data from VIN number, if it exists
    document.getElementById("vin-text").addEventListener("change", vehicle_cv, false);
    document.getElementById("cc").addEventListener("click", roll_displacement, false);
    populate_vin();

}, false);
