function EntryWin(isNewEntry, entryId) {
    var schema = require('schema');
    var db = require('db');
    var EntryInfoView = require('EntryInfoView');

    var entryData = {};
    if (isNewEntry == true) {
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

    var cancelButton = Ti.UI.createLabel({
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

    var saveButton = Ti.UI.createLabel({
        top : '3dp',
        right : '3dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/save.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(saveButton);
    saveButton.addEventListener('click', function(e) {
        if (isNewEntry) {
            db.addEntry(entryData);
        } else {
            db.editEntry(entryData);
        }
        Ti.App.fireEvent('db:update');
        self.close();
    });

    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 2,
        backgroundColor : '#444444'
    });
    self.add(borderView);

    schema.fields.forEach(function(field) {
       var infoView = new EntryInfoView({
            type : field.type,
            name : field.displayName,
            value : entryData[field.name],
            hintText : field.hintText,
            dialogTitle : field.displayName,
            recentPropName : schema.makeRecentPropName(field.name)
        });
        self.add(infoView);
        infoView.addEventListener('change', function(e) {
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