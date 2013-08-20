var moment = require('moment');

/**
 * Capitalises first letter of string.
 */
exports.capitalise = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Encapsulates string in single quotes or any other string.
 * @param {String} string String to be quoted.
 * @param {String} [quoteChar="'"] Character or string used to quote.
 */
exports.quotify = function(string, quoteChar) {
    if ( typeof (quoteChar) === 'undefined')
        quoteChar = "'";
    return quoteChar + string + quoteChar;
};

/**
 * Creates property name for recently used list from name of variable.
 * @param {String} name Name of variable.
 */
exports.makeRecentPropName = function(name){
    return 'recent' + exports.capitalise(name) + 'List';
};

/** 
 * Convert Date object to InDiary date and time format.
 * @param {Date} datetime
 * @returs {String} Formatted date and time.
 */
exports.entryDatetimeFormat = function(datetime) {
    datetime = moment(datetime.toString());
    var formattedTime = datetime.format('HHmm');
    formattedTime += 'hrs';
    var formattedDate = datetime.format('ddd, DD MMM YYYY');
    return formattedTime + ', ' + formattedDate;
};

/**
 * Convert Date object to InDiary date format.
 * @param {Date} datetime
 * @returns {String} Formatted date.
 */
exports.entryDateFormat = function(datetime) {
    datetime = moment(datetime.toString());
    var formattedDate = datetime.format('ddd, DD MMM YYYY');
    return formattedDate;
};

/**
 * Convert Date object to InDiary time format.
 * @param {Date} datetime
 * @returns {String} Formatted time.
 */
exports.entryTimeFormat = function(datetime) {
    datetime = moment(datetime.toString());
    var formattedTime = datetime.format('HHmm');
    formattedTime += 'hrs';
    return formattedTime;
};

/**
 * Returns list of geo:nearby places via 'geo:nearby' event.
 * @param {Object} obj Object for which event is fired.
 * @param {Number} num Maximum number of places to return.
 * @param {Number} radius Search radius around current location.
 */
exports.getNearbyPlaces = function(obj, num, radius) {
    if (Ti.Geolocation.locationServicesEnabled) {
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        Ti.Geolocation.getCurrentPosition(function(e) {
            if (e.error) {
                obj.fireEvent('geo:nearby', {
                    success : false,
                    error : e.error
                }); 
            } else {
                var lat = e.coords.latitude;
                var lon = e.coords.longitude;
                exports.googleNearbyPlaces(obj, lat, lon, num, radius);
            }
        });
    } else {
        obj.fireEvent('geo:nearby', {
            success : false,
            error : 'Location services not enabled.'
        });
    }
}
/**
 * Returns places that match input via 'geo:autocomplete' event.
 * @param {Object} obj Object for which event is fired.
 * @param {String} input Input string to match place names against.
 * @param {String} country ISO 3166-1 alpha-2 country code to restrict search to country.
 * @param {Number} [termsOffset=1] Number of location terms to be excluded in the returned place names.
 */
exports.autocompletePlaces = function(obj, input, country, termsOffset){
    if ( typeof (termsOffset) === 'undefined' )
        termsOffset = 1;
    exports.googleAutocompletePlaces(obj, input, country, termsOffset);
};

/**
 * Gets list of places near supplied coordinate using Google Places API.
 * Returns list to obj via 'geo:nearby' event.
 * @param {Object} obj Object for which event is fired.
 * @param {Object} lat Latitude around which to search.
 * @param {Object} lon Longitiude around which to search.
 * @param {Number} [num=5] Maximum number of places to return.
 * @param {Number} [radius=50] Search radius in metres around current location.
 */
exports.googleNearbyPlaces = function(obj, lat, lon, num, radius) {
    if ( typeof (num) === 'undefined' )
        num = 5;
    if ( typeof (radius) === 'undefined' )
        radius = 50;
    var apiKey = 'AIzaSyBV_i0IiegufftofQyQjkbnFjdYU0TGxRI';
    var urlBase = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?';
    var query = 'sensor=true' + '&location=' + lat + ',' + lon + '&radius=' + radius + '&key=' + apiKey;
    var url = urlBase + query;
    var xhr = Ti.Network.createHTTPClient({
        onload : function(e) {
            var results = JSON.parse(this.responseText).results;
            var places = [];
            var placeNames = [];
            for (var i = 0; i < results.length; i++) {
                places.push(results[i]);
                placeNames.push(results[i].name);
            }
            obj.fireEvent('geo:nearby', {
                success : true,
                places : places,
                placeNames : placeNames
            });
        },
        onerror : function(e) {
            Ti.API.debug(e.error);
            obj.fireEvent('geo:nearby', {
                success : false,
                error : e.error
            });
        },
        timeout : 3000
    });
    xhr.open("GET", url);
    xhr.send();
};

/**
 * Returns places that match input via 'geo:autocomplete' event.
 * Uses Google Places Autocomplete.
 * @param {Object} obj Object for which event is fired.
 * @param {String} input Input string to match place names against.
 * @param {String} country ISO 3166-1 alpha-2 country code to restrict search to country.
 * @param {Number} [termsOffset=1] Number of location terms to be excluded in the returned place names.
 */
exports.googleAutocompletePlaces = function(obj, input, country, termsOffset){
    if ( typeof (termsOffset) === 'undefined' )
        termsOffset = 1;
    var apiKey = 'AIzaSyBV_i0IiegufftofQyQjkbnFjdYU0TGxRI';
    var urlBase = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
    var query = 'sensor=true' + '&input=' + input + '&components=country:' + country + '&key=' + apiKey;
    var url = urlBase + query;
    var xhr = Ti.Network.createHTTPClient({
        onload : function(e) {
            var results = JSON.parse(this.responseText).predictions;
            var places = [];
            var placeNames = [];
            for (var i = 0; i < results.length; i++) {
                places.push(results[i]);
                terms = results[i].terms;
                termNames = [];
                for (var j = 0; j < terms.length - termsOffset; j++){
                    termNames.push(terms[j].value);
                }
                placeNames.push(termNames.join(' '));
            }
            obj.fireEvent('geo:autocomplete', {
                success : true,
                places : places,
                placeNames : placeNames
            });
        },
        onerror : function(e) {
            Ti.API.debug(e.error);
            obj.fireEvent('geo:autocomplete', {
                success : false,
                error : e.error
            });
        },
        timeout : 3000
    });
    xhr.open("GET", url);
    xhr.send();
}