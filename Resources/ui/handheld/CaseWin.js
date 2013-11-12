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
    var DualLabelRow = require('DualLabelRow');

    var caseData = {};
    if (caseId == -1) {
        schema.fields['cases'].forEach(function(field) {
            caseData[field.name] = '';
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
	var nameField = toolbarView.addTextField(caseData.name, L('caseIdDefault'));
	var saveButton = toolbarView.addButton('/images/save.png');

    barIcon.addEventListener('click', function(e) {
        self.close();
    });    
    
    nameField.addEventListener('change', function(e) {
        caseData.name = e.value;
    });

    if (typeof(caseName) == 'string' && caseId == -1)
        nameField.value = caseName;
    
    saveButton.addEventListener('click', function(e) {
        if (caseId == -1) {
            db.addRow('cases', caseData);
        } else {
            db.editRow('cases', caseData);
        }
        if (typeof(parent) === 'object'){
            parent.fireEvent('update', {value: caseData});
        }
        self.close();
    });

    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
    });
    self.add(borderView);

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