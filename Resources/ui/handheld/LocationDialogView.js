var LocationDialogView = function(value, hintText, recentPropName){
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

    var searchBar = toolbarView.addTextField('', hintText, true);

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
        locationTable.reset();
        if (Ti.Geolocation.locationServicesEnabled && Ti.Network.online){
            nearbySection.visible = true;
            util.getNearbyPlaces(dialogView);
        }
        if (nearbySection.rows.length == 0)
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
    searchBar.addEventListener('change', function(e) {
        var autocompleteUpdateTable = function() {
            if (Ti.Network.online && e.value.length > 1) {
                util.autocompletePlaces(dialogView, e.value,
                                        Ti.App.Properties.
                                            getString('countryCode', 'sg'));
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
            autocompleteTimer = setTimeout(autocompleteUpdateTable,
                                           util.searchTimeout);
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

module.exports = LocationDialogView;