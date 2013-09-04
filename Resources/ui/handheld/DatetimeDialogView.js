var DatetimeDialogView = function(value){
    var util = require('util');
    var theme = require('ui/theme');
    var DynamicTableView = require('DynamicTableView');

    var dialogView = Ti.UI.createView({
        height: Ti.UI.SIZE,
        layout : 'vertical',
        backgroundColor: theme.backgroundColor,
        value : value
    });
    var timePicker = Ti.UI.createPicker({
        type : Ti.UI.PICKER_TYPE_TIME,
        format24 : true
    });
    var datePicker = Ti.UI.createPicker({
        type : Ti.UI.PICKER_TYPE_DATE
    });
    dialogView.add(timePicker);
    dialogView.add(datePicker);
    dialogView.addEventListener('open', function(e) {
        timePicker.value = dialogView.value;
        datePicker.value = dialogView.value;
        dialogView.justOpened = true;
    });
    timePicker.addEventListener('change', function(e) {
        if (dialogView.justOpened) {
            dialogView.justOpened = false;
        } else {
            var date = dialogView.value;
            var time = e.value;
            var datetime = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                                    time.getHours(), time.getMinutes(), time.getSeconds());
            dialogView.value = datetime;
        }
    });
    datePicker.addEventListener('change', function(e) {
        var date = e.value;
        var time = dialogView.value;
        var datetime = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                                time.getHours(), time.getMinutes(), time.getSeconds());
        dialogView.value = datetime;
    }); 
    return dialogView;
};

module.exports = DatetimeDialogView;