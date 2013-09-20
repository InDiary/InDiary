var CasesDialogView = function(value, hintText, recentPropName){
    var util = require('util');
    var db = require('db');
    var theme = require('ui/theme');
    var DynamicTableView = require('DynamicTableView');
    
    var dialogView = Ti.UI.createView({
        height : Ti.UI.SIZE,
        layout : 'vertical',
        backgroundColor: theme.backgroundColor,
        value : value
    });

    var searchBar = Ti.UI.createTextField({
        width : Ti.UI.FILL,
        color: theme.primaryTextColor,
        backgroundColor: theme.backgroundColor,
        hintText : hintText,
        softKeyboardOnFocus : Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS        
    });
    dialogView.add(searchBar);
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

    dialogView.addEventListener('open', function(e) {
        dialogView.justOpened = true;
        searchBar.value = db.selectRow('cases', searchBar.value).name;
        searchBar.focus();
        var recentValues = Ti.App.Properties.getList(recentPropName, []);
        recentValues.reverse();
        if (recentValues.length > 0) {
            recentSection.rows = [];
            recentValues.forEach(function(value){
                var caseName = db.selectRow('cases', value).name;
                var row = recentSection.addRow(caseName, {caseId: value});
            });
            recentSection.visible = true;
            casesTable.update();
        }
    });

    var autocompleteTimer = 0;
    searchBar.addEventListener('change', function(e) {
        var autocompleteUpdateTable = function() {
            suggestedSection.rows = [];
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
            });
            suggestedSection.visible = true;
            casesTable.update();
        };
        if (!dialogView.justOpened){
            clearTimeout(autocompleteTimer);
            autocompleteTimer = setTimeout(autocompleteUpdateTable,
                                           util.searchTimeout);
        } else {
            dialogView.justOpened = false;            
        }
    });
    
    casesTable.addEventListener('click', function(e) {
        if (e.rowData.selectable == true) {
            dialogView.value = e.rowData.caseId;
            searchBar.value = e.rowData.title;
        }
    });

    return dialogView;
};

module.exports = CasesDialogView;