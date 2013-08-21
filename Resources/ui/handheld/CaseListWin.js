/**
 * Window displaying list of cases.
 */
function CaseListWin() {
	var util = require('util');
    var theme = require('ui/theme');
	var db = require('db');
	var CaseWin = require('CaseWin');
	var ToolbarView = require('ToolbarView');
    var DualLabelRow = require('DualLabelRow');

	var self = Ti.UI.createWindow({
		title:L('entries'),
		backgroundColor:theme.backgroundColor,
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
		
	var toolbarView = new ToolbarView();
	mainView.add(toolbarView);

	var borderView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: theme.borderColor
	});
	mainView.add(borderView);
	
	var titleLabel = toolbarView.addLabel(L('cases'));
	var newButton = toolbarView.addButton('/images/new.png');
	
	newButton.addEventListener('click', function() {
        new CaseWin(-1).open();    
	});
    
	var table = Ti.UI.createTableView();
    table.searchCriteria = {
        orderBy: 'id',
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
        var casesData = db.selectRows('cases', table.searchCriteria);
        casesData.forEach(function(caseData) {
            var caseRow = new DualLabelRow(caseData.name, '',
                                           {caseId: caseData.id});
            tableData.push(caseRow);
        });
        table.setData(tableData);
    });
	
    table.addEventListener('click', function(e) {
        new CaseWin(e.rowData.caseId).open();
    });
    
    Ti.App.addEventListener('db:update', function(e) {
        table.fireEvent('update');
    });
    
    table.fireEvent('update');

	return self;
};

module.exports = CaseListWin;
