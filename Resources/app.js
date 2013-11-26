if (Ti.version < 3.0 ) {
	alert('Titanium Mobile SDK 3.0 or later required');
}

(function() {
    var db = require('db');

	var osname = Ti.Platform.osname,
		version = Ti.Platform.version,
		height = Ti.Platform.displayCaps.platformHeight,
		width = Ti.Platform.displayCaps.platformWidth;
	
	var isTablet = osname === 'ipad' ||
        (osname === 'android' && (width > 899 || height > 899));
    
	db.createDatabase();
    
	var ListWin = require('ui/handheld/ListWin');
	new ListWin('entries').open();
})();
