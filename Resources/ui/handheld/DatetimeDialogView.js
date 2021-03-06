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
    dialogView.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '10dp'
    }));
    dialogView.add(timePicker);
    dialogView.add(datePicker);
    dialogView.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '10dp'
    }));    
    dialogView.addEventListener('open', function(e) {
        timePicker.value = dialogView.value;
        datePicker.value = dialogView.value;
    });
    var mergeDateAndTime = function(date, time){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                        time.getHours(), time.getMinutes(), time.getSeconds());
    };
    timePicker.addEventListener('change', function(e) {
        dialogView.value = mergeDateAndTime(dialogView.value, e.value);
    });
    datePicker.addEventListener('change', function(e) {
        dialogView.value = mergeDateAndTime(e.value, dialogView.value);
    }); 
    return dialogView;
};

module.exports = DatetimeDialogView;