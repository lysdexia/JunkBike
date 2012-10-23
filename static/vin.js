var VIN = function () {
    // from http://en.wikipedia.org/wiki/Vehicle_Identification_Number
    var vin_rexp = new RegExp("[ABCDEFGHJKLMNPRSTUVWXYZ0123456789]{8}[ABCDEFGHJKLMNPRSTUVWXYZ0123456789][ABCDEFGHJKLMNPRSTVWXY123456789][ABCDEFGHJKLMNPRSTUVWXYZ0123456789]{4}[0-9]{3}", "i");

    return {
        extract_vin: function () {
            if (vin_rexp.exec(location.search) != null) {
                return vin_rexp.exec(location.search)[0].toUpperCase();
            }
            return null;
        }
    };
}();
