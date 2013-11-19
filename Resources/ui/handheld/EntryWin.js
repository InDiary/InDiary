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
    var FieldView = require('FieldView');

    var entryData = {};
    if (entryId == -1) {
        schema.fields['entries'].forEach(function(field) {
            if (util.inArray(field.type, ['string', 'areaString'])){
                entryData[field.name] = '';
            } else if (field.type == 'datetime'){
                entryData[field.name] = new Date();                
            } else {
                var recentPropName = util.makeRecentPropName('entries', 
                                                             field.name);
                var recentList =
                    Ti.App.Properties.getList(recentPropName, ['']);
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

    var barIcon = toolbarView.addBarIcon('/images/appicon.png', 
                                         '/images/up.png');
	var blurbLabel = toolbarView.addLabel(entryData.text, L('newEntry'));
	var saveButton = toolbarView.addButton('/images/save.png');

    barIcon.addEventListener('click', function(e) {
        self.close();
    });

    saveButton.addEventListener('click', function(e) {
        if (entryId == -1) {
            db.addRow('entries', entryData);
        } else {
            db.editRow('entries', entryData);
        }
        schema.fields['entries'].forEach(function(field) {
            if (util.inArray(field.type, ['string', 'areaString', 'datetime']))
                return;
            var recentPropName = util.makeRecentPropName('entries', field.name);
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
        });
        self.close();
    });

    var borderView = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
    });
    self.add(borderView);

    var scrollView = Ti.UI.createScrollView({
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        contentHeight : Ti.UI.SIZE,
        layout : 'vertical'
    });
    self.add(scrollView);

    schema.fields['entries'].forEach(function(field) {
        if (field.type == 'areaString'){
            var textArea = Ti.UI.createTextArea({
                top: '3dp',
                width : Titanium.UI.FILL,
                height : Titanium.UI.SIZE,
                borderWidth : 0,
                color : theme.primaryTextColor,
                backgroundColor : theme.backgroundColor,
                hintText: field.hintText,
                value : entryData[field.name]
            });
            scrollView.add(textArea);
            textArea.addEventListener('change', function(e) {
                entryData[field.name] = e.value;
                if (field.showInToolbar){
                    blurbLabel.text = e.value;
                    blurbLabel.fireEvent('change', {value: e.value});
                }
            });
            scrollView.add(Ti.UI.createView({
                width : Ti.UI.FILL,
                height : 1,
                backgroundColor : theme.borderColor
            }));            
            return;
        }
        var textFormatter = function(arg){return arg};
        var dialogViewConstructor;
        switch (field.name){
            case 'caseId':
                textFormatter = function(caseId){
                    return db.selectRow('cases', caseId).name;
                };
                dialogViewConstructor = require('CasesDialogView');
                break;
            default:
                switch (field.type){
                    case 'datetime':
                        textFormatter = util.entryDatetimeFormat;
                        dialogViewConstructor = require('DatetimeDialogView');
                        break;
                    case 'location':
                        dialogViewConstructor = require('LocationDialogView');
                        break;
                    case 'string':
                        dialogViewConstructor = require('StringDialogView');
                        break;
                }
                break;
        }
        var fieldView = new FieldView({
            name : field.displayName,
            value : entryData[field.name],
            hintText : field.hintText,
            textFormatter : textFormatter,
            dialogTitle : field.displayName,
            dialogViewConstructor : dialogViewConstructor,
            recentPropName : util.makeRecentPropName('entries', field.name)
        });
        scrollView.add(fieldView);
        fieldView.addEventListener('change', function(e) {
            entryData[field.name] = e.value;
            if (field.showInToolbar){
                blurbLabel.text = e.value;
                blurbLabel.fireEvent('change', {value: e.value});
            }
        });
        scrollView.add(Ti.UI.createView({
            width : Titanium.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    });

    return self;
};

module.exports = EntryWin;