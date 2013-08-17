/**
 * View that overlays EntryListWin with search bar and advanced search options.
 */
function EntrySearchView(obj) {
	var util = require('util');
    var schema = require('schema');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var DatetimeRangeView = require('DatetimeRangeView');
	var SearchFieldView = require('SearchFieldView');
    
    var searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        text: ''
    };

    var self = Ti.UI.createView({
    	top: '0dp',
    	left: '0dp',
    	width: Ti.UI.FILL,
		height: Ti.UI.SIZE,
		layout: 'vertical',
		touchEnabled: false,
		visible: false
	});
    
    var toolbarView = new ToolbarView();
    self.add(toolbarView);

    var searchBar = Ti.UI.createTextField({
		top: '4dp',
		height: '42dp',
		left: '3dp',
		right: '93dp',
		backgroundColor : theme.toolbarBackgroundColor,
        color : theme.primaryToolbarTextColor,
		hintText: L('searchEntries'),
		softKeyboardOnFocus : Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
	});
	searchBar.addEventListener('change', function(e) {
		searchCriteria['text'] = e.value;
		self.fireEvent('change');
	});
	toolbarView.add(searchBar);
	    
	var cancelButton = toolbarView.addButton('/images/cancel.png');
	var moreButton = toolbarView.addButton('/images/more.png');

    cancelButton.addEventListener('click', function(e) {
    	searchBar.blur();
        self.visible = false;
    });
    
    moreButton.addEventListener('click', function(e) {
        moreView.visible = !moreView.visible;
    });
    
	var borderView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: theme.borderColor
	});
	self.add(borderView);

    var moreView = Ti.UI.createView({
		layout: 'vertical',
        backgroundColor : theme.backgroundColor,
        height: Ti.UI.SIZE,
        width : Ti.UI.FILL,
        visible: false
    });
    self.add(moreView);
	
    schema.fields.forEach(function(field) {
        if (field.type == 'datetime'){
            var startDate = new Date();
            var endDate = new Date();
            startDate.setMonth(endDate.getMonth()-1);
            var searchFieldView = new DatetimeRangeView({
                name : field.displayName,
                value : [startDate, endDate]
            });
        } else {
            var searchFieldView = new SearchFieldView({
                type : field.type,
                name : field.displayName,
                value : '',
                hintText : field.hintText
            });
        }
        searchFieldView.addEventListener('change', function(e) {
            if (field.type == 'datetime'){
                searchCriteria[field.name + 'Range'] = searchFieldView.value;
            } else {
                searchCriteria[field.name] = searchFieldView.value;
            }
            self.fireEvent('change');
        });
        moreView.add(searchFieldView);
        moreView.add(Ti.UI.createView({
            width : Ti.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    });

	self.addEventListener('open', function(e){
		self.visible = true;
		searchBar.focus();
	});

	self.addEventListener('change', function(e) {
		obj.fireEvent('search', {searchCriteria: searchCriteria});
	});

	return self;
};

module.exports = EntrySearchView;
