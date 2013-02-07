function ListWin() {
	var util = require('util');
	var db = require('db');
	var EntryWin = require('EntryWin');
	
	function createEntryRow(entryData) {
		
        var row = Ti.UI.createTableViewRow({
            height : Ti.UI.SIZE,
            backgroundColor: 'black',
            backgroundSelectedColor: '#BBBBBB',
            className : 'entryRow',
            entryId : entryData.id
        });
		
		var blurb = Ti.UI.createLabel({
			top: '7dp',
			left: '11dp',
			right: '11dp',
			text: entryData.text,
			color: 'white',
			font: {
     		 	fontSize: '22dp',
  			},
  			wordWrap: false,
  			ellipsize: true,
  			touchEnabled: false
		});
		row.add(blurb);
		
		var metadata = Ti.UI.createLabel({
			top: '37dp',
			bottom: '5dp',
			left: '11dp',
			right: '11dp',
			text: util.entryDatetimeFormat(entryData.datetime) + ', '
				+ entryData.location,
			color: 'gray',
			font: {
     		 	fontSize: '15dp'
  			},
  			wordWrap: false,
  			ellipsize: true,
  			touchEnabled: false
		});
		row.add(metadata);
		
		return row;
	};

	var self = Ti.UI.createWindow({
		title:L('entries'),
		backgroundColor:'black',
		layout: 'vertical'
	});
	
	var toolbarView = Ti.UI.createView({
		width: Titanium.UI.FILL,
		height: '48dp'
	});
	self.add(toolbarView);

	var borderView = Ti.UI.createView({
		width: Titanium.UI.FILL,
		height: 2,
		backgroundColor: '#444444'
	});
	self.add(borderView);
	
	var newButton = Ti.UI.createButton({
		top: '3dp',
		left: '3dp',
		width: '42dp',
		height: '42dp',
		backgroundImage: '/images/newentry.png',
		backgroundSelectedColor: '#BBBBBB'
	});
	toolbarView.add(newButton);
	newButton.addEventListener('click', function() {
		self.containingTab.open(new EntryWin(-1));
	});
	
	var searchBar = Ti.UI.createTextField({
		top: '4dp',
		height: '42dp',
		left: '48dp',
		right: '48dp',
		backgroundColor : 'black',
        color : 'white',
		hintText: L('searchEntries')
	});
	toolbarView.add(searchBar);
	
	var advSearchButton = Ti.UI.createButton({
		top: '3dp',
		right: '3dp',
		width: '42dp',
		height: '42dp',
		backgroundImage: '/images/settings.png',
		backgroundSelectedColor: '#BBBBBB'
	});
	toolbarView.add(advSearchButton);

	var table = Ti.UI.createTableView();
	self.add(table);

	Ti.App.addEventListener('db:update', function(e) {
        var tableData = [];
        table.setData([]); 
        var entriesData = db.selectEntries();
        entriesData.forEach(function(entryData) {
            tableData.push(createEntryRow(entryData));
        });
        table.setData(tableData);
	});
	
    table.addEventListener('click', function(e) {
        self.containingTab.open(new EntryWin(e.rowData.entryId));
    });
    
    Ti.App.fireEvent('db:update');

	return self;
};

module.exports = ListWin;
