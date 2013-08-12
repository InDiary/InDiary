/**
 * @classdesc A view displaying an editable datetime range.
 * @param {Object} vars Object containing DatetimeRangeField properties.
 * @property {String} name Name of the date field.
 * @property {Array} value Pair of datetime values.
 */
function DatetimeRangeView(vars) {
    var util = require('util');
    var theme = require('theme');
    var EntryFieldView = require('EntryFieldView');
    
    var self = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : Ti.UI.SIZE,
        layout: 'vertical',
        backgroundColor: theme.backgroundColor,
        touchEnabled: false,
        value: vars.value.slice(0)
    });

    var fromFieldView = new EntryFieldView({
        type : 'datetime',
        name : L('start') + ' ' + vars.name,
        value : self.value[0],
        dialogTitle : vars.name
    });
    self.add(fromFieldView);
    fromFieldView.addEventListener('change', function(e) {
    	var over_range = (e.value > self.value[1]);
        self.value[0] = (!over_range) ? e.value : self.value[1];
        if (over_range){
        	fromFieldView.value = self.value[0];
        	fromFieldView.fireEvent('change', {value: fromFieldView.value});
        }
        self.fireEvent('change', {value: self.value.slice(0)});
    });
    
    self.add(Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    }));
        
    var toFieldView = new EntryFieldView({
        type : 'datetime',
        name : L('end') + ' ' + vars.name,
        value : self.value[1],
        dialogTitle : vars.name
    });
    self.add(toFieldView);
    toFieldView.addEventListener('change', function(e) {
    	var under_range = (e.value < self.value[0]);
        self.value[1] = (!under_range) ? e.value : self.value[0];
        if (under_range){
        	toFieldView.value = self.value[1];
        	toFieldView.fireEvent('change', {value: toFieldView.value});
        }
        self.fireEvent('change', {value: self.value.slice(0)});
    });
    
    return self;
};

module.exports = DatetimeRangeView;