/**
 * @classdesc A view displaying an editable datetime range.
 * @param {Object} vars Object containing DatetimeRangeField properties.
 * @property {String} name Name of the date field.
 * @property {Array} value Pair of datetime values.
 */
function DatetimeRangeView(vars) {
    var util = require('util');
    var EntryFieldView = require('EntryFieldView');
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout: 'vertical',
        backgroundColor: 'black',
        backgroundSelectedColor: 'black',
        touchEnabled: false,
        value: vars.value
    });

    var fromFieldView = new EntryFieldView({
        type : 'datetime',
        name : L('start') + ' ' + vars.name,
        value : vars.value[0],
        dialogTitle : vars.name
    });
    self.add(fromFieldView);
    fromFieldView.addEventListener('change', function(e) {
        self.value[0] = e.value;
        self.fireEvent('change', {value: self.value});
    });
    
    self.add(Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : '#444444'
    }));
        
    var toFieldView = new EntryFieldView({
        type : 'datetime',
        name : L('end') + ' ' + vars.name,
        value : vars.value[1],
        dialogTitle : vars.name
    });
    self.add(toFieldView);
    toFieldView.addEventListener('change', function(e) {
        self.value[1] = e.value;
        self.fireEvent('change', {value: self.value});
    });
    
    return self;
};

module.exports = DatetimeRangeView;