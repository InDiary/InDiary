/**
 * @classdesc A view displaying editable entry information.
 * @param {Object} vars Object containing EntryFieldView properties.
 * @property {String} type Type of information, either 'datetime', 'location' or 'string'.
 * @property {String} name Name of the information field.
 * @property {Date|String|Number} value Value of information field.
 * @property {String} hintText Hint text for information field.
 * @property {String} dialogTitle Title of dialog that pops up when pressed.
 * @property {String} recentPropName App property name of list of recently used entry information.
 */
function EntryFieldView(vars) {
    var util = require('util');
    var theme = require('ui/theme');
    var DialogWin = require('DialogWin');
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        horizontalWrap : false,
        backgroundColor: theme.backgroundColor,
        backgroundSelectedColor: theme.backgroundSelectedColor,
        type : vars.type,
        value : vars.value
    });
    
    var valueField = Ti.UI.createLabel({
        top : '7dp',
        left : '11dp',
        right: '11dp',
        color : theme.primaryTextColor,
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        font : {
            fontSize : theme.primaryFontSize
        },
        hintText: vars.hintText,
        wordWrap: false,
        touchEnabled: false,
        ellipsize : true
    });
    switch (self.type) {
        case 'datetime':
            valueField.text = util.entryDatetimeFormat(self.value);
            break;
        default:
            if (self.value == '') {
                valueField.text = valueField.hintText;
            } else {
                valueField.text = self.value;
            }
            break;
    }
    self.add(valueField);
    
    var nameField = Ti.UI.createLabel({
        top : '37dp',
        bottom: '5dp',
        left : '11dp',
        right: '11dp',
        color : theme.secondaryFontColor,
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        font : {
            fontSize : theme.secondaryFontSize
        },
        text : vars.name,
        wordWrap: false,
        touchEnabled: false,
        ellipsize : true
    });
    self.add(nameField);

    self.addEventListener('click', function(e) {
		switch (self.type) {
			case 'datetime':
				self.dialogView = new require('DatetimeDialogView')(self.value);
				break;
			case 'location':
				self.dialogView = new require('LocationDialogView')(self.value, vars.hintText, vars.recentPropName);
				break;
			case 'string':
				self.dialogView = new require('StringDialogView')(self.value, vars.hintText, vars.recentPropName);
				break;
		}
		new DialogWin(self, vars.dialogTitle, self.dialogView).open();
        self.dialogView.fireEvent('open');
    });

    self.addEventListener('dialog:done', function(e) {
        if (e.set === true) {
            self.value = self.dialogView.value;
            self.fireEvent('change', {value: self.value});
        }
    });

    self.addEventListener('change', function(e) {
        switch (self.type) {
            case 'datetime':
                valueField.text = util.entryDatetimeFormat(self.value);
                break;
            default:
                if (self.value == '') {
                    valueField.text = valueField.hintText;
                } else {
                    valueField.text = self.value;
                }
                break;
        }
    });

    return self;
};

module.exports = EntryFieldView;