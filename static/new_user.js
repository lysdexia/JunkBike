function validate_new_user () {
    var tld;
    var name;   
    var email = document.getElementById("email-text").value;
    if (email === "") {
        alert("debug no email");
        return false;
    }
    name = email.split("@")[0];
    if (name === "") {
        alert("debug undefined name");
        return false;
    }
    tld = email.split(".");
    if (tld.length === 1) {
        tld = undefined;
    }
    tld = tld[tld.length -1];
    if (tld === "" || tld === undefined) {
        tld = undefined;
    }
    return {"name": name, "tld": 
}


document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    // validate new user form
    document.getElementById("validate-new-user").addEventListener("click", validate_new_user, false);

}, false);
