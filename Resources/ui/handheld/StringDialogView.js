var StringDialogView = function(value, hintText){
    var util = require('util');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var DynamicTableView = require('DynamicTableView');

    var dialogView = Ti.UI.createView({
        height : Ti.UI.SIZE,
        layout : 'vertical',
        backgroundColor: theme.backgroundColor,
        value : value
    });
    
    var toolbarView = new ToolbarView();
    dialogView.add(toolbarView);

    var textField = toolbarView.addTextField('', hintText);

    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    });
    dialogView.add(borderView);

    dialogView.addEventListener('open', function(e) {
        textField.value = dialogView.value;
        textField.focus();
    });
    textField.addEventListener('change', function(e) {
        dialogView.value = e.value;
    });
    return dialogView;
};

module.exports = StringDialogView;