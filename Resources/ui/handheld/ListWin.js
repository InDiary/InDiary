/**
 * Window displaying list of data.
 */
function ListWin(tableName) {
	var util = require('util');
	var db = require('db');
    var schema = require('schema');
    var json2csv = require('json2csv');
    var theme = require('ui/theme');
	var MenuWin = require('MenuWin');
	var DataWin = require('DataWin');
	var ToolbarView = require('ToolbarView');
	var DataSearchView = require('DataSearchView');
    var DualLabelRow = require('DualLabelRow');

	var self = Ti.UI.createWindow({
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
	var titleLabel = toolbarView.addLabel(schema.metadata[tableName].
                                          displayName);
	var newButton = toolbarView.addButton('/images/new.png');
	var exportButton = toolbarView.addButton('/images/export.png');
	var searchButton = toolbarView.addButton('/images/search.png');

    var scrollView = Ti.UI.createScrollView({
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        contentHeight : Ti.UI.SIZE,
        layout : 'vertical'
    });
    mainView.add(scrollView);

	var dataSearchView = new DataSearchView(tableName, table);
	self.add(dataSearchView);

	barIcon.addEventListener('click', function() {
        new MenuWin().open({
            activityEnterAnimation: Ti.App.Android.R.anim.push_right_in,
            activityExitAnimation: Ti.Android.R.anim.fade_out
        });
	});
    
	newButton.addEventListener('click', function() {
		new DataWin(tableName, -1).open();
	});

	exportButton.addEventListener('click', function() {
        var outputDir = (Ti.Filesystem.isExternalStoragePresent()) ?
            Ti.Filesystem.externalStorageDirectory :
            Ti.Filesystem.applicationDataDirectory;
        var csvFile = Ti.Filesystem.getFile(outputDir, 'InDiary.csv');
        var rowsData = db.selectRows(tableName, table.searchCriteria);
        var fieldNames = []
        schema.fields[tableName].forEach(function(field) {
            fieldNames.push(field.name);
        });
		json2csv(
            {data: rowsData, fields: fieldNames, del: '\t'},
            function(err, csv) {
                if (err) alert(err);
                csvFile.write(csv);
            });
	});    
    
	searchButton.addEventListener('click', function() {
		dataSearchView.fireEvent('open');
    });

    var table = Ti.UI.createTableView({
        left : '7.5dp',
        right : '7.5dp',
        separatorColor : theme.borderColor
    });
    table.searchCriteria = {
        orderBy: schema.metadata[tableName].orderBy,
        ascending: false,
    };
	scrollView.add(table);

    scrollView.add(Ti.UI.createView({
        left : '7.5dp',
        right : '7.5dp',
        height : 1,
        backgroundColor : theme.borderColor
    }));    

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
        var rowsData = db.selectRows(tableName, table.searchCriteria);
        rowsData.forEach(function(rowData) {
            var primaryText = schema.metadata[tableName].
                    rowPrimaryText(rowData);
            var secondaryText = schema.metadata[tableName].
                    rowSecondaryText(rowData);
            var row = new DualLabelRow(primaryText, secondaryText,
                                       {rowId: rowData.id});
            tableData.push(row);
        });
        if (tableData.length == 0){
            tableData.push(new DualLabelRow(L('noDataPrimary'),
                                            L('noDataSecondary'),
                                            {rowId: -1}));
        }
        table.setData(tableData);
        var tableRowHeight = (new DualLabelRow('', '').height).
                              slice(0, -2);
        table.height = Number(tableRowHeight) * tableData.length + 'dp';
    });
	
    table.addEventListener('click', function(e) {
        new DataWin(tableName, e.rowData.rowId).open();
    });

    self.addEventListener('focus', function(e) {
        table.fireEvent('update');
    });

	return self;
};

module.exports = ListWin;
