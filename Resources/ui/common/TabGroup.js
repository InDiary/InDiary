function TabGroup() {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//load window types
	var Win = require('ui/handheld/Win');
	var ListWin = require('ui/handheld/ListWin');
	
	//create app tabs
	var winEntries = new ListWin(),
		winReferences = new Win(L('references')),
		winSettings = new Win(L('settings'));
	
	var tabEntries = Ti.UI.createTab({
		title: L('entries'),
		icon: '/images/entries.png',
		window: winEntries
	});
	winEntries.containingTab = tabEntries;
	
	var tabReferences = Ti.UI.createTab({
		title: L('references'),
		icon: '/images/references.png',
		window: winReferences
	});
	winReferences.containingTab = tabReferences;

	var tabSettings = Ti.UI.createTab({
		title: L('settings'),
		icon: '/images/settings.png',
		window: winSettings
	});
	winSettings.containingTab = tabSettings;
	
	self.addTab(tabEntries);
	self.addTab(tabReferences);
	self.addTab(tabSettings);
	
	return self;
};

module.exports = TabGroup;
