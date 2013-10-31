var CasesDialogView = function(value, hintText, recentPropName){
    var util = require('util');
    var db = require('db');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var DynamicTableView = require('DynamicTableView');
    var CaseWin = require('CaseWin');
    
    var dialogView = Ti.UI.createView({
        height : Ti.UI.SIZE,
        layout : 'vertical',
        backgroundColor: theme.backgroundColor,
        value : value
    });

    var validCaseId = typeof(value) == 'number' && value > 0;

    var toolbarView = new ToolbarView();
    dialogView.add(toolbarView);

    var searchBar = toolbarView.addTextField('', L('searchEntries'));
	searchBar.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;

    var newButton = toolbarView.addButton('/images/new.png');
	    
    newButton.addEventListener('click', function() {
        new CaseWin(dialogView, -1, searchBar.value).open();    
	});
    
    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    });
    dialogView.add(borderView);
    
    var casesTable = new DynamicTableView({
        width : Ti.UI.FILL,
        height : Ti.Platform.displayCaps.platformHeight * 0.5
    });
    dialogView.add(casesTable);

    var suggestedSection = casesTable.addDynamicSection(L('suggested'));
    var recentSection = casesTable.addDynamicSection(L('recent'));
    var allSection = casesTable.addDynamicSection(L('all'));
    
    dialogView.addEventListener('open', function(e) {
        dialogView.justOpened = true;
        validCaseId = typeof(value) == 'number' && value > 0;
        searchBar.value = db.selectRow('cases', value).name;
        searchBar.focus();
        searchBar.font = (validCaseId) ?
            {fontWeight : 'bold'} : {fontWeight : 'normal'};
        var recentValues = Ti.App.Properties.getList(recentPropName, []);
        recentValues.reverse();
        if (recentValues.length > 0) {
            recentSection.rows = [];
            recentValues.forEach(function(value){
                var caseName = db.selectRow('cases', value).name;
                var row = recentSection.addRow(caseName, {caseId: value});
            });
            recentSection.visible = true;
        }
        var casesData = db.selectRows('cases', 
            {orderBy: 'id', ascending: false});
        casesData.forEach(function(caseData){
            var row = allSection.addRow(caseData.name, caseData.id);
        });
        allSection.visible = true;
        casesTable.update();
    });

    dialogView.addEventListener('update', function(e) {
        searchBar.value = e.value.name;
    });
    
    var autocompleteTimer = 0;
    searchBar.addEventListener('change', function(e) {
        var autocompleteUpdateTable = function() {
            suggestedSection.rows = [];
            if (e.value.length > 1) {
                var searchCriteria = {
                    orderBy: 'id',
                    ascending: false,
                    name: e.value
                };
                var casesData = db.selectRows('cases', searchCriteria);
                if (casesData.length == 0) {
                    suggestedSection.visible = false;
                    casesTable.update();
                    return;
                }
                casesData.forEach(function(caseData) {
                    var row = suggestedSection.addRow(caseData.name,
                                                      {caseId: caseData.id});
                    if (searchBar.value == caseData.name){
                        validCaseId = true;
                        dialogView.value = caseData.id;
                        searchBar.font = {fontWeight : 'bold'};
                    }
                });
                suggestedSection.visible = true;
                allSection.visible = false;
            } else {
                suggestedSection.visible = false;
                allSection.visible = true;
            }
            casesTable.update();
        };
        if (!dialogView.justOpened){
            if (validCaseId) {
                searchBar.font = {fontWeight : 'normal'};
                validCaseId = false;
            }
            clearTimeout(autocompleteTimer);
            autocompleteTimer = setTimeout(autocompleteUpdateTable,
                                           util.searchTimeout);
        } else {
            dialogView.justOpened = false;
        }
    });
    
    casesTable.addEventListener('click', function(e) {
        if (e.rowData.selectable == true) {
            validCaseId = true;
            dialogView.value = e.rowData.caseId;
            searchBar.value = e.rowData.title;
            searchBar.font = {fontWeight : 'bold'};            
        }
    });

    return dialogView;
};

module.exports = CasesDialogView;