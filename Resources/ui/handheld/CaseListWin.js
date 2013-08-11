function CaseListWin() {
	var util = require('util');
	var db = require('db');
	
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
		height: '48dp'
	});
	mainView.add(toolbarView);

	var borderView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: '#444444'
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
		text: L('cases')
	});
	toolbarView.add(titleLabel);
	
	var newButton = Ti.UI.createButton({
		top: '3dp',
		right: '3dp',
		width: '42dp',
		height: '42dp',
		backgroundImage: '/images/new.png',
		backgroundSelectedColor: '#BBBBBB'
	});
	toolbarView.add(newButton);
	newButton.addEventListener('click', function() {
	});
    
	var table = Ti.UI.createTableView();
    table.searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        text: ''
    };
	mainView.add(table);
    
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
        table.setData(tableData);
    });
	
    table.addEventListener('click', function(e) {
    });
    
    Ti.App.addEventListener('db:update', function(e) {
        table.fireEvent('update');
    });
    
    table.fireEvent('update');

	return self;
};

module.exports = CaseListWin;
