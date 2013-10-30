if (Ti.version < 1.8 ) {
	alert('Titanium Mobile SDK 1.8 or later required');
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
    
	var EntryListWin = require('ui/handheld/EntryListWin');
	new EntryListWin().open();
})();
