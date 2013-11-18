/**
 * Window displaying list of cases.
 */
function CaseListWin() {
	var util = require('util');
    var theme = require('ui/theme');
	var db = require('db');
	var MenuWin = require('MenuWin');
	var CaseWin = require('CaseWin');
	var ToolbarView = require('ToolbarView');
    var DualLabelRow = require('DualLabelRow');

	var self = Ti.UI.createWindow({
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

    var barIcon = toolbarView.addBarIcon('/images/appicon.png', 
                                         '/images/drawer.png');
	var titleLabel = toolbarView.addLabel(L('cases'));
	var newButton = toolbarView.addButton('/images/new.png');

	barIcon.addEventListener('click', function() {
        new MenuWin().open({
            activityEnterAnimation: Ti.App.Android.R.anim.push_right_in,
            activityExitAnimation: Ti.Android.R.anim.fade_out
        });
	});
	
	newButton.addEventListener('click', function() {
        new CaseWin(-1).open();    
	});
    
	var table = Ti.UI.createTableView({
	    separatorColor : theme.borderColor
	});
    table.searchCriteria = {
        orderBy: 'id',
        ascending: false
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

    self.addEventListener('focus', function(e) {
        table.fireEvent('update');
    });
   
	return self;
};

module.exports = CaseListWin;
