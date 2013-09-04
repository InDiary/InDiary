var StringDialogView = function(value, hintText, recentPropName){
    var util = require('util');
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
        softKeyboardOnFocus : Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
    });
    dialogView.add(textField);
    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    });
    dialogView.add(borderView);
    var recentTable = new DynamicTableView({
        width : Ti.UI.FILL,
        height : Ti.Platform.displayCaps.platformHeight * 0.5
    });
    dialogView.add(recentTable);
    var recentSection = recentTable.addDynamicSection(L('recent'));
    dialogView.addEventListener('open', function(e) {
        textField.value = dialogView.value;
        textField.focus();
        var recentValues = Ti.App.Properties.getList(recentPropName, []);
        recentValues.reverse();
        if (recentValues.length > 0) {
            recentSection.rows = [];
            for (var i = 0; i < recentValues.length; i++) {
                recentSection.addRow(recentValues[i]);
            }
            recentSection.visible = true;
            recentTable.update();
            borderView.visible = true;
            recentTable.visible = true;
        } else {
            borderView.visible = false;
            recentTable.visible = false;
        }
    });
    textField.addEventListener('change', function(e) {
        dialogView.value = e.value;
    });
    recentTable.addEventListener('click', function(e) {
        if (e.rowData.selectable == true) {
            textField.value = e.rowData.title;
        }
    }); 
    return dialogView;
};

module.exports = StringDialogView;