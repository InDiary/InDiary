/**
 * Window displaying list of entries.
 */
function EntryListWin() {
	var util = require('util');
	var db = require('db');
    var theme = require('ui/theme');
	var CaseListWin = require('CaseListWin');
	var EntryWin = require('EntryWin');
	var EntrySearchView = require('EntrySearchView');
    var DualLabelRow = require('DualLabelRow');

	var self = Ti.UI.createWindow({
		title:L('entries'),
		backgroundColor: theme.backgroundColor,
		navBarHidden: true
	});
	
	var mainView = Ti.UI.createView({
		top: '0dp',
		left: '0dp',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		layout: 'vertical'
	});
	self.add(mainView);
		
	var toolbarView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: '48dp',
        backgroundColor: theme.toolbarBackgroundColor
	});
	mainView.add(toolbarView);

	var borderView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: theme.borderColor
	});
	mainView.add(borderView);
	
	var titleLabel = Ti.UI.createLabel({
		top: '2dp',
		height: '42dp',
		left: '11dp',
		right: '48dp',
        color : 'white',
        font : {
            fontSize: '18dp'
        },
		text: L('entries')
	});
	toolbarView.add(titleLabel);
	
	var searchButton = Ti.UI.createButton({
		top: '3dp',
		right: '93dp',
		width: '42dp',
		height: '42dp',
		backgroundImage: '/images/search.png',
		backgroundSelectedColor: theme.toolbarBackgroundSelectedColor
	});
	toolbarView.add(searchButton);

	var casesButton = Ti.UI.createButton({
		top: '3dp',
		right: '48dp',
		width: '42dp',
		height: '42dp',
		backgroundImage: '/images/cases.png',
		backgroundSelectedColor: theme.toolbarBackgroundSelectedColor
	});
	toolbarView.add(casesButton);
	casesButton.addEventListener('click', function() {
		new CaseListWin().open();
	});
	
	var newButton = Ti.UI.createButton({
		top: '3dp',
		right: '3dp',
		width: '42dp',
		height: '42dp',
		backgroundImage: '/images/new.png',
		backgroundSelectedColor: theme.toolbarBackgroundSelectedColor
	});
	toolbarView.add(newButton);
	newButton.addEventListener('click', function() {
		new EntryWin(-1).open();
	});
    
	var table = Ti.UI.createTableView();
    table.searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        text: ''
    };
	mainView.add(table);

	var entrySearchView = new EntrySearchView(table);
	self.add(entrySearchView);

	searchButton.addEventListener('click', function() {
		entrySearchView.fireEvent('open');
    });
    
    var searchTimer = 0;
    var searchTimeout = 300;
    table.addEventListener('search', function(e) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function(){
        	table.searchCriteria = e.searchCriteria;
            table.fireEvent('update');
        }, searchTimeout);
    });
    
    table.addEventListener('update', function(e) {
        var tableData = [];
        var entriesData = db.selectEntries(table.searchCriteria);
        entriesData.forEach(function(entryData) {
            var metadataText = util.entryDatetimeFormat(entryData.datetime) +
                               ', ' + entryData.location;
            var entryRow = new DualLabelRow(entryData.text, metadataText,
                                            {entryId: entryData.id});
            tableData.push(entryRow);
        });
        table.setData(tableData);
    });
	
    table.addEventListener('click', function(e) {
        new EntryWin(e.rowData.entryId).open();
    });
    
    Ti.App.addEventListener('db:update', function(e) {
        table.fireEvent('update');
    });
    
    table.fireEvent('update');

	return self;
};

module.exports = EntryListWin;
