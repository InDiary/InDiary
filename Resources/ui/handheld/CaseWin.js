/**
 * Window for adding a new case or editing an existing one.
 * @param {Number} caseId Id of case to be edited. -1 corresponds to a new case.
 */
function CaseWin(caseId, caseName, parent) {
    var util = require('util');
    var schema = require('schema');
    var db = require('db');
    var theme = require('ui/theme');
	var EntryWin = require('EntryWin');
    var ToolbarView = require('ToolbarView');
    var FieldView = require('FieldView');
    var DualLabelRow = require('DualLabelRow');

    var caseData = {};
    if (caseId == -1) {
        schema.fields['cases'].forEach(function(field) {
            if (util.inArray(field.type, ['string', 'areaString'])){
                caseData[field.name] = '';
            } else if (field.type == 'datetime'){
                caseData[field.name] = new Date();                
            } else {
                var recentPropName = util.makeRecentPropName('cases',
                                                             field.name);
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
            if (util.inArray(field.type, ['string', 'areaString', 'datetime']))
                return;
            if (caseData[field.name] === '')
                return;
            var recentPropName = util.makeRecentPropName('cases', field.name);
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

    var scrollView = Ti.UI.createScrollView({
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        contentHeight : Ti.UI.SIZE,
        layout : 'vertical'
    });
    self.add(scrollView);

    schema.fields['cases'].forEach(function(field) {
        if (field.type == 'areaString'){
            var textArea = Ti.UI.createTextArea({
                top: '3dp',
                width : Ti.UI.FILL,
                height : Ti.UI.SIZE,
                borderWidth : 0,
                color : theme.primaryTextColor,
                backgroundColor : theme.backgroundColor,
                hintText: field.hintText,
                value : caseData[field.name]
            });
            scrollView.add(textArea);
            textArea.addEventListener('change', function(e) {
                caseData[field.name] = e.value;
                if (field.showInToolbar){
                    nameLabel.text = e.value;
                    nameLabel.fireEvent('change', {value: e.value});
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
            value : caseData[field.name],
            hintText : field.hintText,
            textFormatter : textFormatter,
            dialogTitle : field.displayName,
            dialogViewConstructor : dialogViewConstructor,
            recentPropName : util.makeRecentPropName('cases', field.name)
        });
        scrollView.add(fieldView);
        fieldView.addEventListener('change', function(e) {
            caseData[field.name] = e.value;
            if (field.showInToolbar){
                nameLabel.text = e.value;
                nameLabel.fireEvent('change', {value : e.value});
            }
        });
        scrollView.add(Ti.UI.createView({
            width : Ti.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    });

    var table = Ti.UI.createTableView({
        width : Ti.UI.FILL,
        separatorColor : theme.borderColor
    });
    table.searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        caseId: caseId
    };
	scrollView.add(table);
    
    scrollView.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    }));

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
        var entryRowHeight = (new DualLabelRow('', '').height).slice(0, -2);
        table.height = Number(entryRowHeight) * tableData.length + 'dp';
    });
	
    table.addEventListener('click', function(e) {
        new EntryWin(e.rowData.entryId).open();
    });

    self.addEventListener('focus', function(e) {
        table.fireEvent('update');
        scrollView.scrollTo(0,0);
    });
    
    return self;
};

module.exports = CaseWin;