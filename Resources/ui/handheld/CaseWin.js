/**
 * Window for adding a new entry or editing an existing one.
 * @param {Number} entryId Id of entry to be edited. -1 corresponds to a new entry.
 */
function CaseWin(caseId, caseName, parent) {
    var util = require('util');
    var schema = require('schema');
    var db = require('db');
    var theme = require('ui/theme');
	var EntryWin = require('EntryWin');
    var ToolbarView = require('ToolbarView');
    var EntryFieldView = require('EntryFieldView');    
    var DualLabelRow = require('DualLabelRow');

    var caseData = {};
    if (caseId == -1) {
        schema.fields['cases'].forEach(function(field) {
            if (field.type == 'string'){
                caseData[field.name] = '';
            } else if (field.type == 'datetime'){
                caseData[field.name] = new Date();                
            } else {
                var recentPropName = util.makeRecentPropName(field.name);
                var recentList =
                    Ti.App.Properties.getList(recentPropName, ['']);
                caseData[field.name] = recentList.slice(-1)[0];
            }
        });
    } else {
        caseData = db.selectRow('cases', caseId);
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
	var nameLabel = toolbarView.addLabel(caseData.name, L('newCase'));
	var saveButton = toolbarView.addButton('/images/save.png');

    barIcon.addEventListener('click', function(e) {
        self.close();
    });

    if (typeof(caseName) == 'string' && caseId == -1)
        caseData['name'] = caseName;
    
    saveButton.addEventListener('click', function(e) {
        if (caseId == -1) {
            db.addRow('cases', caseData);
        } else {
            db.editRow('cases', caseData);
        }
        if (typeof(parent) === 'object'){
            parent.fireEvent('update', {value: caseData});
        }
        schema.fields['cases'].forEach(function(field) {
            if (field.type == 'string' || field.type == 'datetime')
                return;
            if (caseData[field.name] === '')
                return;
            var recentPropName = util.makeRecentPropName(field.name);
            var recentList = Ti.App.Properties.getList(recentPropName, []);
            if (recentList.indexOf(entryData[field.name]) != - 1){
                recentList = recentList.filter(function(element, index, array) {
                    return (element != caseData[field.name]);
                });
            }
            recentList.push(caseData[field.name]);
            if (recentList.length > schema.maxRecentFieldEntries){
                recentList = recentList.slice(-schema.maxRecentFieldEntries);
            }
            Ti.App.Properties.setList(recentPropName, recentList);
        });
        self.close();
    });

    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
    });
    self.add(borderView);

    schema.fields['cases'].forEach(function(field) {
        var textFormatter = function(arg){return arg};
        var dialogViewConstructor;
        switch (field.name){
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
        
        var fieldView = new EntryFieldView({
            name : field.displayName,
            value : caseData[field.name],
            hintText : field.hintText,
            textFormatter : textFormatter,
            dialogTitle : field.displayName,
            dialogViewConstructor : dialogViewConstructor,
            recentPropName : util.makeRecentPropName(field.name)
        });
        self.add(fieldView);
        fieldView.addEventListener('change', function(e) {
            caseData[field.name] = e.value;
            if (field.name == 'name'){
                nameLabel.text = e.value;
                nameLabel.fireEvent('change', {value : e.value});
            }
        });
        self.add(Ti.UI.createView({
            width : Titanium.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    });

    var table = Ti.UI.createTableView();
    table.searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        caseId: caseId
    };
	self.add(table);

    table.addEventListener('update', function(e) {
        var tableData = [];
        var entriesData = db.selectRows('entries', table.searchCriteria);
        entriesData.forEach(function(entryData) {
            var metadataText = util.entryDatetimeFormat(entryData.datetime) +
                               ', ' + entryData.location;
            var entryRow = new DualLabelRow(entryData.text, metadataText,
                                            {entryId: entryData.id});
            tableData.push(entryRow);
        });
        table.setData(tableData);
    });
	
    table.addEventListener('click', function(e) {
        new EntryWin(table, e.rowData.entryId).open();
    });

    self.addEventListener('focus', function(e) {
        table.fireEvent('update');
    });
    
    return self;
};

module.exports = CaseWin;