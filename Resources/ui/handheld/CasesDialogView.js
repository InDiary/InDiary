var CasesDialogView = function(value, hintText, tableName, recentPropName){
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
    var textField = Ti.UI.createTextField({
        width : Ti.UI.FILL,
        color: theme.primaryTextColor,
        backgroundColor: theme.backgroundColor,
        hintText : hintText,
        focusable : false,
        enabled : false
    });
    dialogView.add(textField);
    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    });
    dialogView.add(borderView);
    var casesTable = new DynamicTableView({
        width : Ti.UI.FILL,
        height : Ti.Platform.displayCaps.platformHeight * 0.5;
    });
    dialogView.add(casesTable);
    var recentSection = casesTable.addDynamicSection(L('recent'));
    dialogView.addEventListener('open', function(e) {
        textField.value = dialogView.value;
        var recentValues = Ti.App.Properties.getList(recentPropName, []);
        recentValues.reverse();
        if (recentValues.length > 0) {
            recentSection.rows = [];
            recentValues.forEach(function(value){
                var caseName = db.selectRow(tableName, value);
                var row = recentSection.addRow(caseName);
                row.caseId = value;
            });
            recentSection.visible = true;
            casesTable.update();
            borderView.visible = true;
            casesTable.visible = true;
        } else {
            borderView.visible = false;
            casesTable.visible = false;
        }
    });
    casesTable.addEventListener('click', function(e) {
        if (e.rowData.selectable == true) {
            dialogView.value = e.rowData.caseId;
            textField.value = e.rowData.title;
        }
    });
    return dialogView;
};

module.exports = CasesDialogView;