/**
 * Window for adding a new entry or editing an existing one.
 * @param {Number} entryId Id of entry to be edited. -1 corresponds to a new entry.
 */
function EntryWin(entryId) {
    var schema = require('schema');
    var db = require('db');
    var EntryFieldView = require('EntryFieldView');

    var entryData = {};
    if (entryId == -1) {
        entryData['text'] = '';
        schema.fields.forEach(function(field) {
            if (field.name == 'datetime'){
                entryData[field.name] = new Date();                
            } else {
                var recentPropName = schema.makeRecentPropName(field.name);
                var recentList = Ti.App.Properties.getList(recentPropName, ['']);
                entryData[field.name] = recentList.slice(-1)[0];
            }
        });
    } else {
        entryData = db.selectEntry(entryId);
    }

    var self = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor : 'black',
        layout : 'vertical'
    });

    var toolbarView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : '48dp'
    });
    self.add(toolbarView);

    var blurbField = Ti.UI.createTextField({
        top : '6dp',
        left : '3dp',
        right : '93dp',
        height : '42dp',
        backgroundColor : 'black',
        color : 'white',
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        hintText : L('newEntry'),
        font : {
            fontSize : '18dp'
        },
        value : entryData.text,
        focusable: false,
        enabled : false,
        ellipsize : true
    });
    toolbarView.add(blurbField);

    var cancelButton = Ti.UI.createButton({
        top : '3dp',
        right : '48dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/cancel.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(cancelButton);
    cancelButton.addEventListener('click', function(e) {
        self.close();
    });

    var saveButton = Ti.UI.createButton({
        top : '3dp',
        right : '3dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/save.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(saveButton);
    saveButton.addEventListener('click', function(e) {
        if (entryId == -1) {
            db.addEntry(entryData);
        } else {
            db.editEntry(entryData);
        }
        Ti.App.fireEvent('db:update');
        schema.fields.forEach(function(field) {
            if (field.name != 'datetime') {
                var recentPropName = schema.makeRecentPropName(field.name);
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
        backgroundColor : '#444444'
    });
    self.add(borderView);

    schema.fields.forEach(function(field) {
       var fieldView = new EntryFieldView({
            type : field.type,
            name : field.displayName,
            value : entryData[field.name],
            hintText : field.hintText,
            dialogTitle : field.displayName,
            recentPropName : schema.makeRecentPropName(field.name)
        });
        self.add(fieldView);
        fieldView.addEventListener('change', function(e) {
            entryData[field.name] = e.value;
        });
        self.add(Ti.UI.createView({
            width : Titanium.UI.FILL,
            height : 1,
            backgroundColor : '#444444'
        }));
    });

    var entryTextArea = Ti.UI.createTextArea({
        top: '3dp',
        width : Titanium.UI.FILL,
        height : Titanium.UI.FILL,
        borderWidth : 0,
        color : 'white',
        backgroundColor : 'black',
        hintText: L('emptyEntryText'),
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