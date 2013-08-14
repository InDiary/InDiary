var util = require('util');
var theme = require('ui/theme');
var DynamicTableView = require('DynamicTableView');

exports.createDatetimeDialogView = function(value){
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

exports.createLocationDialogView = function(value, hintText, recentPropName){
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
        hintText: hintText,
        softKeyboardOnFocus : Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
    });
    dialogView.add(searchBar);

    dialogView.add(Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    }));
    
    var locationTable = new DynamicTableView({
        width : Ti.UI.FILL,
        height : Ti.Platform.displayCaps.platformHeight * 0.5
    });
    dialogView.add(locationTable);

    var suggestedSection = locationTable.addDynamicSection(L('suggested'));
    var nearbySection = locationTable.addDynamicSection(L('nearby'));
    var recentSection = locationTable.addDynamicSection(L('recent'));

    dialogView.addEventListener('open', function(e) {
        dialogView.justOpened = true;
        searchBar.value = dialogView.value;
        searchBar.focus();
        locationTable.reset();
        if (Ti.Geolocation.locationServicesEnabled && Ti.Network.online){
            nearbySection.visible = true;
            util.getNearbyPlaces(dialogView);
        }
        nearbySection.addRow(L('loading'));
        var recentLocations = Ti.App.Properties.getList(recentPropName, []);
        if (recentLocations.length > 0){
            for (var i = 0; i < recentLocations.length; i++) {
                recentSection.addRow(recentLocations[i]);
            }
            recentSection.visible = true; 
        }
        locationTable.update();
    });
    
    dialogView.addEventListener('geo:nearby', function(e) {
        nearbySection.rows = [];
        if (e.success){
            for (var i = 0; i < e.placeNames.length; i++) {
                nearbySection.addRow(e.placeNames[i]);
            }
        } else {
            nearbySection.addRow(L('locationError'));
        }
        nearbySection.visible = true;
        locationTable.update();
    });

    dialogView.addEventListener('geo:autocomplete', function(e) {
        suggestedSection.rows = [];
        if (e.success){
            for (var i = 0; i < e.placeNames.length; i++) {
                suggestedSection.addRow(e.placeNames[i]);
            }
        }
        if (suggestedSection.rows.length == 0){
            suggestedSection.addRow(L('locationError'));
        }
        suggestedSection.visible = true;
        locationTable.update();
    });

    var autocompleteTimer = 0;
    var autocompleteTimeout = 300;
    searchBar.addEventListener('change', function(e) {
        var autocompleteUpdateTable = function() {
            if (Ti.Network.online && e.value.length > 1) {
                util.autocompletePlaces(dialogView, e.value,
                                        Ti.App.Properties.getString('countryCode', 'sg'));
                if (!suggestedSection.visible) {
                    suggestedSection.addRow(L('loading'));
                    suggestedSection.visible = true;
                    locationTable.update();
                }
            } else {
                suggestedSection.rows = [];
                suggestedSection.visible = false;
                locationTable.update();
            }
        }; 
        if (!dialogView.justOpened){
            clearTimeout(autocompleteTimer);
            autocompleteTimer = setTimeout(autocompleteUpdateTable, autocompleteTimeout);
        } else {
            dialogView.justOpened = false;            
        }
        dialogView.value = e.value;
    });
    
    locationTable.addEventListener('click', function(e) { 
        if (e.rowData.selectable == true) {
            searchBar.value = e.rowData.title;
            searchBar.fireEvent('change', {value: searchBar.value});
        }
    });
    
    return dialogView;
};

exports.createStringDialogView = function(value, hintText, recentPropName){
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
        height : 0
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
            recentTable.height = Ti.Platform.displayCaps.platformHeight * 0.5;
        } else {
            borderView.visible = false;
            recentTable.height = 0;
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