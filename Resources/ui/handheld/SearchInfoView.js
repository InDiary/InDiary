/**
 * @classdesc A view displaying editable entry information.
 * @param {Object} vars Object containing EntryInfoView properties.
 * @property {String} type Type of information, either 'datetime', 'location' or 'string'.
 * @property {String} name Name of the information field.
 * @property {Date|String|Number} value Value of information field.
 * @property {String} hintText Hint text for information field.
 */
function SearchInfoView(vars) {
    var util = require('util');
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout: 'vertical',
        backgroundColor: 'black',
        backgroundSelectedColor: '#BBBBBB',
        type : vars.type,
        value : vars.value
    });
    
    var searchField = Ti.UI.createTextField({
        top : '3dp',
        left : '0dp',
        right: '0dp',
        backgroundColor: 'black',
        color : 'white',
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        value: vars.value,
        hintText: vars.hintText
    });
    self.add(searchField);
    
    searchField.addEventListener('change', function(e) {
        self.value = e.value;
        self.fireEvent('change');
    });
    
    var nameField = Ti.UI.createLabel({
        top : '-5dp',
        bottom: '5dp',
        left : '11dp',
        right: '11dp',
        color : 'gray',
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        font : {
            fontSize : '15dp'
        },
        text : vars.name,
        wordWrap: false,
        touchEnabled: false,
        ellipsize : true
    });
    self.add(nameField);

    return self;
};

module.exports = SearchInfoView;