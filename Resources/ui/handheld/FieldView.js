/**
 * @classdesc A view displaying editable entry information.
 * @param {Object} vars Object containing EntryFieldView properties.
 * @property {String} name Name of the information field.
 * @property {Date|String|Number} value Value of information field.
 * @property {String} hintText Hint text for information field.
 * @property {Function} textFormatter Function that formats value into text displayed.
 * @property {String} dialogTitle Title of dialog that pops up when pressed.
 * @property {Function} dialogViewConstructor Function that creates dialog view.
 * @property {String} recentPropName App property name of list of recently used entry information.
 */
function FieldView(vars) {
    var util = require('util');
    var theme = require('ui/theme');
    var DialogWin = require('DialogWin');
    
    vars.textFormatter = (typeof(vars.textFormatter) === 'undefined') ?
        function(arg){return arg} : vars.textFormatter;
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '61dp',
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
    if (self.value == '') {
        valueField.text = valueField.hintText;
    } else {
        valueField.text = vars.textFormatter(self.value);
    }
    self.add(valueField);
    
    var nameField = Ti.UI.createLabel({
        top : '37dp',
        bottom: '5dp',
        left : '11dp',
        right: '11dp',
        color : theme.secondaryTextColor,
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
        self.dialogView = new vars.dialogViewConstructor(self.value,
                                                         vars.hintText,
                                                         vars.recentPropName);
		new DialogWin(self, vars.dialogTitle, self.dialogView).open({
            activityEnterAnimation: Ti.App.Android.R.anim.contract_in
        });
        self.dialogView.fireEvent('open');
    });

    self.addEventListener('dialog:done', function(e) {
        if (e.set === true) {
            self.value = self.dialogView.value;
            self.fireEvent('change', {value: self.value});
        }
    });

    self.addEventListener('change', function(e) {
        if (self.value == '') {
            valueField.text = valueField.hintText;
        } else {
            valueField.text = vars.textFormatter(self.value);
        }
    });

    return self;
};

module.exports = FieldView;