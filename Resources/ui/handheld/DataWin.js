/**
 * Window for adding a new data entry or editing an existing one.
 * @param {Number} id Id of row to be edited. -1 corresponds to a new row.
 */
function DataWin(tableName, id, data, parent) {
    var util = require('util');
    var schema = require('schema');
    var db = require('db');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var FieldView = require('FieldView');
    var DualLabelRow = require('DualLabelRow');

    if (typeof(data) === 'undefined'){
        data = {};
    }
    if (id == -1) {
        schema.fields[tableName].forEach(function(field) {
            if (typeof(data[field.name]) != 'undefined'){
                return;
            } else if (util.inArray(field.type, ['string', 'areaString'])){
                data[field.name] = '';
            } else if (field.type == 'datetime'){
                data[field.name] = new Date();
            } else if (field.type == 'list'){
                return;
            } else {
                var recentPropName = util.makeRecentPropName(tableName,
                                                             field.name);
                var recentList =
                    Ti.App.Properties.getList(recentPropName, ['']);
                data[field.name] = recentList.slice(-1)[0];
                if (field.type == 'id' && typeof(data[field.name]) != 'number'){
                    data[field.name] = 1;
                }
            }
        });
    } else {
        data = db.selectRow(tableName, id);
    }
    
    var self = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor : theme.backgroundColor,
        layout : 'vertical'
    });

    var toolbarView = new ToolbarView();
    self.add(toolbarView);

    var labelField = '';
    var labelHintText = '';
    schema.fields[tableName].forEach(function(field) {
        if (field.showInToolbar){
            labelField = field.name;
            labelHintText = field.toolbarHintText;
        }
    });
    
    var barIcon = toolbarView.addBarIcon('/images/appicon.png', 
                                         '/images/up.png');    
	var nameLabel = toolbarView.addLabel(data[labelField], labelHintText);
	var saveButton = toolbarView.addButton('/images/save.png');

    barIcon.addEventListener('click', function(e) {
        self.close();
    });
    
    saveButton.addEventListener('click', function(e) {
        if (id == -1) {
            db.addRow(tableName, data);
        } else {
            db.editRow(tableName, data);
        }
        if (typeof(parent) === 'object'){
            parent.fireEvent('update', {value: data});
        }
        schema.fields[tableName].forEach(function(field) {
            if (util.inArray(field.type, ['string', 'areaString',
                                          'datetime', 'list']))
                return;
            if (data[field.name] === '')
                return;
            var recentPropName = util.makeRecentPropName(tableName, field.name);
            var recentList = Ti.App.Properties.getList(recentPropName, []);
            if (recentList.indexOf(data[field.name]) != - 1){
                recentList = recentList.filter(function(element, index, array) {
                    return (element != data[field.name]);
                });
            }
            recentList.push(data[field.name]);
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

    schema.fields[tableName].forEach(function(field) {
        var containerView = Ti.UI.createView({
            left : '7.5dp',
            right : '7.5dp',
            height : Ti.UI.SIZE,
            layout : 'vertical'
        });
        scrollView.add(containerView);
        if (field.type == 'areaString'){
            var textArea = Ti.UI.createTextArea({
                top : '0dp',
                width : Ti.UI.FILL,
                height : Ti.UI.SIZE,
                borderWidth : 0,
                color : theme.primaryTextColor,
                font : {
                    fontSize : theme.primaryFontSize
                },
                backgroundColor : 'transparent',
                hintText: field.hintText,
                value : data[field.name]
            });
            containerView.add(textArea);
            textArea.addEventListener('change', function(e) {
                data[field.name] = e.value;
                if (field.showInToolbar){
                    nameLabel.text = e.value;
                    nameLabel.fireEvent('change', {value: e.value});
                }
            });
            var textAreaLabel = Ti.UI.createLabel({
                top : '-8dp',
                left : '11dp',
                right: '11dp',
                color : theme.secondaryTextColor,
                textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
                font : {
                    fontSize : theme.secondaryFontSize
                },
                text : field.displayName,
                wordWrap: false,
                touchEnabled: false,
                ellipsize : true
            });
            containerView.add(textAreaLabel);
            containerView.add(Ti.UI.createView({
                top : '5dp',
                width : Ti.UI.FILL,
                height : 1,
                backgroundColor : theme.borderColor
            }));
            return;
        }
        if (field.type == 'list'){
            var tableLabel = Ti.UI.createLabel({
                text : field.displayName.toUpperCase(),
                color : theme.secondaryTextColor,
                backgroundColor: theme.backgroundColor,
                backgroundSelectedColor: theme.backgroundColor,
                width : Ti.UI.FILL,
                left :'11dp',
                height : '28dp',
                textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
                font : {
                    fontSize : theme.secondaryFontSize,
                    fontWeight : 'bold'
                },
                wordWrap: false,
                touchEnabled: false,
                ellipsize : true
            });
            containerView.add(tableLabel);
            containerView.add(Ti.UI.createView({
                width : Ti.UI.FILL,
                height : 1,
                backgroundColor : theme.borderColor
            }));

            var table = Ti.UI.createTableView({
                width : Ti.UI.FILL,
                separatorColor : theme.borderColor
            });
            table.searchCriteria = {
                orderBy: schema.metadata[field.tableName].orderBy,
                ascending: false
            };
            table.searchCriteria[field.idField] = id;
            containerView.add(table);
            
            containerView.add(Ti.UI.createView({
                width : Ti.UI.FILL,
                height : 1,
                backgroundColor : theme.borderColor
            }));

            table.addEventListener('update', function(e) {
                var tableData = [];
                var rowsData = db.selectRows(field.tableName,
                                             table.searchCriteria);
                rowsData.forEach(function(rowData) {
                    var primaryText = schema.metadata[field.tableName].
                        rowPrimaryText(rowData);
                    var secondaryText = schema.metadata[field.tableName].
                        rowSecondaryText(rowData);
                    var tableRow = new DualLabelRow(primaryText, secondaryText,
                                                    {rowId: rowData.id});
                    tableData.push(tableRow);
                });
                table.setData(tableData);
                var tableRowHeight = Number((new DualLabelRow('', '').height).
                    slice(0, -2))*Ti.Platform.displayCaps.logicalDensityFactor;
                table.height = (tableRowHeight + 1) * tableData.length - 1;
                containerView.visible = (tableData.length > 0);
            });
            
            table.addEventListener('click', function(e) {
                new DataWin(field.tableName, e.rowData.rowId).open();
            });

            self.addEventListener('focus', function(e) {
                table.fireEvent('update');
            });
            return;
        }
        var textFormatter = function(arg){return arg};
        var dialogViewConstructor;
        switch (field.type){
            case 'datetime':
                textFormatter = util.datetimeFormat;
                dialogViewConstructor = require('DatetimeDialogView');
                break;
            case 'location':
                dialogViewConstructor = require('LocationDialogView');
                break;
            case 'string':
                dialogViewConstructor = require('StringDialogView');
                break;
            case 'id':
                textFormatter = function(id){
                    return schema.metadata[field.tableName]
                        .rowPrimaryText(db.selectRow(field.tableName, id));
                };
                switch (field.tableName){
                    case 'cases':
                        dialogViewConstructor = require('CasesDialogView');
                        break;
                }
                break;
        }
        var fieldView = new FieldView({
            name : field.displayName,
            value : data[field.name],
            hintText : field.hintText,
            textFormatter : textFormatter,
            dialogTitle : field.displayName,
            dialogViewConstructor : dialogViewConstructor,
            recentPropName : util.makeRecentPropName(tableName, field.name)
        });
        containerView.add(fieldView);
        fieldView.addEventListener('change', function(e) {
            data[field.name] = e.value;
            if (field.showInToolbar){
                nameLabel.text = e.value;
                nameLabel.fireEvent('change', {value : e.value});
            }
        });
        containerView.add(Ti.UI.createView({
            width : Ti.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    });

    self.addEventListener('focus', function(e) {
        scrollView.scrollTo(0,0);
    });
    
    return self;
};

module.exports = DataWin;