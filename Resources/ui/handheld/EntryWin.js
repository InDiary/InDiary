/**
 * Window for adding a new entry or editing an existing one.
 * @param {Number} entryId Id of entry to be edited. -1 corresponds to a new entry.
 */
function EntryWin(entryId) {
    var util = require('util');
    var schema = require('schema');
    var db = require('db');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var EntryFieldView = require('EntryFieldView');

    var entryData = {};
    if (entryId == -1) {
        schema.entryFields.forEach(function(field) {
            if (field.name == 'text'){
                entryData[field.name] = '';
            } else if (field.name == 'datetime'){
                entryData[field.name] = new Date();                
            } else {
                var recentPropName = util.makeRecentPropName(field.name);
                var recentList = Ti.App.Properties.getList(recentPropName, ['']);
                entryData[field.name] = recentList.slice(-1)[0];
            }
        });
    } else {
        entryData = db.selectRow('entries', entryId);
    }

    var self = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor : theme.backgroundColor,
        layout : 'vertical'
    });

    var toolbarView = new ToolbarView();
    self.add(toolbarView);

	var blurbField = toolbarView.addTextField(entryData.text, L('newEntry'));
	blurbField.focusable = false;
	blurbField.enabled = false;
	var cancelButton = toolbarView.addButton('/images/cancel.png');
	var saveButton = toolbarView.addButton('/images/save.png');

    cancelButton.addEventListener('click', function(e) {
        self.close();
    });

    saveButton.addEventListener('click', function(e) {
        if (entryId == -1) {
            db.addRow('entries', entryData);
        } else {
            db.editRow('entries', entryData);
        }
        Ti.App.fireEvent('db:update');
        schema.entryFields.forEach(function(field) {
            if (field.name != 'text' && field.name != 'datetime') {
                var recentPropName = util.makeRecentPropName(field.name);
                var recentList = Ti.App.Properties.getList(recentPropName, []);
                if (recentList.indexOf(entryData[field.name]) != - 1){
                    recentList = recentList.filter(function(element, index, array) {
                        return (element != entryData[field.name]);
                    });
                }
                recentList.push(entryData[field.name]);
                if (recentList.length > schema.maxRecentFieldEntries){
                    recentList = recentList.slice(-schema.maxRecentFieldEntries);
                }
                Ti.App.Properties.setList(recentPropName, recentList);
            }
        }); 
        self.close();
    });

    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
    });
    self.add(borderView);

    schema.entryFields.forEach(function(field) {
        if (field.name == 'text')
            return;
        var fieldView = new EntryFieldView({
            type : field.type,
            name : field.displayName,
            value : entryData[field.name],
            hintText : field.hintText,
            dialogTitle : field.displayName,
            recentPropName : util.makeRecentPropName(field.name)
        });
        self.add(fieldView);
        fieldView.addEventListener('change', function(e) {
            entryData[field.name] = e.value;
        });
        self.add(Ti.UI.createView({
            width : Titanium.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    });

    var entryTextArea = Ti.UI.createTextArea({
        top: '3dp',
        width : Titanium.UI.FILL,
        height : Titanium.UI.FILL,
        borderWidth : 0,
        color : theme.primaryTextColor,
        backgroundColor : theme.backgroundColor,
        hintText: L('entryTextDefault'),
        value : entryData.text
    });
    self.add(entryTextArea);
    entryTextArea.addEventListener('change', function(e) {
        blurbField.value = e.value;
        entryData.text = e.value;
    });

    return self;
};

module.exports = EntryWin;