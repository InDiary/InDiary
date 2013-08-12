/**
 * @classdesc A view displaying a search field.
 * @param {Object} vars Object containing SearchFieldView properties.
 * @property {String} type Type of information, either 'datetime', 'location' or 'string'.
 * @property {String} name Name of the information field.
 * @property {String} value Value of information field.
 * @property {String} hintText Hint text for information field.
 */
function SearchFieldView(vars) {
    var util = require('util');
    var theme = require('theme');
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout: 'vertical',
        backgroundColor: theme.backgroundColor,
        type : vars.type,
        value : vars.value,
        touchEnabled: false
    });
    
    var searchField = Ti.UI.createTextField({
        top : '0dp',
        left : '0dp',
        right: '0dp',
        backgroundColor: theme.backgroundColor,
        color : theme.primaryTextColor,
        font : {
            fontSize : theme.primaryFontSize
        },
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        value: vars.value,
        hintText: vars.hintText
    });
    self.add(searchField);
    
    searchField.addEventListener('change', function(e) {
        self.value = e.value;
        self.fireEvent('change', {value: self.value});
    });
    
    var nameField = Ti.UI.createLabel({
        top : '-8dp',
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

    return self;
};

module.exports = SearchFieldView;