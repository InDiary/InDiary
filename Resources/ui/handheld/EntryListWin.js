/**
 * Window displaying list of entries.
 */
function EntryListWin() {
	var util = require('util');
	var db = require('db');
    var theme = require('ui/theme');
	var CaseListWin = require('CaseListWin');
	var EntryWin = require('EntryWin');
	var ToolbarView = require('ToolbarView');
	var EntrySearchView = require('EntrySearchView');
    var DualLabelRow = require('DualLabelRow');

	var self = Ti.UI.createWindow({
		title:L('entries'),
		backgroundColor: theme.backgroundColor,
		navBarHidden: true,
		exitOnClose: true
	});
	
	var mainView = Ti.UI.createView({
		top: '0dp',
		left: '0dp',
		width: Ti.UI.FILL,
		height: Ti.UI.FILL,
		layout: 'vertical'
	});
	self.add(mainView);
		
	var toolbarView = new ToolbarView();
	mainView.add(toolbarView);

	var borderView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: theme.borderColor
	});
	mainView.add(borderView);

    var barIcon = toolbarView.addBarIcon('/images/appicon.png', 
                                         '/images/drawer.png');
	var titleLabel = toolbarView.addLabel(L('entries'));
	var newButton = toolbarView.addButton('/images/new.png');
	var casesButton = toolbarView.addButton('/images/cases.png');	
	var searchButton = toolbarView.addButton('/images/search.png');
	    
	var table = Ti.UI.createTableView();
    table.searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        text: ''
    };
	mainView.add(table);

	var entrySearchView = new EntrySearchView(table);
	self.add(entrySearchView);

	newButton.addEventListener('click', function() {
		new EntryWin(table, -1).open();
	});

	casesButton.addEventListener('click', function() {
		new CaseListWin().open();
	});

	searchButton.addEventListener('click', function() {
		entrySearchView.fireEvent('open');
    });
    
    var searchTimer = 0;
    table.addEventListener('search', function(e) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function(){
        	table.searchCriteria = e.searchCriteria;
            table.fireEvent('update');
        }, util.searchTimeout);
    });
    
    table.addEventListener('update', function(e) {
        var tableData = [];
        var entriesData = db.selectRows('entries', table.searchCriteria);
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
        new EntryWin(table, e.rowData.entryId).open();
    });
        
    table.fireEvent('update');

	return self;
};

module.exports = EntryListWin;
