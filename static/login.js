
function new_user () {
    document.forms["new-user-form"].submit()
}

document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    // attempt to extract useful data from VIN number, if it exists
    document.getElementById("new-user").addEventListener("click", new_user, false); 
}, false);
