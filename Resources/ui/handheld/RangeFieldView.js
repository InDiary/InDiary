/**
 * @classdesc A view displaying a search field.
 * @param {Object} vars Object containing RangeFieldView properties.
 * @property {String} type Type of information, either 'datetime', 'location' or 'string'.
 * @property {String} name Name of the information field.
 * @property {Date|String|Number} value Value of information field.
 * @property {String} hintText Hint text for information field.
 */
function RangeFieldView(vars) {
    var util = require('util');
    var EntryFieldView = require('EntryFieldView');
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout: 'vertical',
        backgroundColor: 'black',
        backgroundSelectedColor: 'black',
        touchEnabled: false
    });

    var fromFieldView = new EntryFieldView({
        type : vars.type,
        name : vars.name,
        value : '',
        hintText : vars.hintText,
        dialogTitle : '',
        recentPropName : ''
    });
    self.add(fromFieldView);
    
    self.add(Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : '#444444'
    }));
        
    var toFieldView = new EntryFieldView({
        type : vars.type,
        name : vars.name,
        value : '',
        hintText : vars.hintText,
        dialogTitle : '',
        recentPropName : ''
    });
    self.add(toFieldView);

    return self;
};

module.exports = RangeFieldView;