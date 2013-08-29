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

    var searchBar = toolbarView.addTextField('', L('searchEntries'));
	searchBar.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	searchBar.addEventListener('change', function(e) {
		searchCriteria['text'] = e.value;
		self.fireEvent('change');
	});

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
	
	var addSearchViewCallback = function(field) {
        var searchCriteria = this;
        if (field.name == 'text')
            return;
        if (field.type == 'id'){
            searchCriteria[field.name + 'Criteria'] = {};
            schema.fields[field.tableName].
                forEach(addSearchViewCallback,
                        searchCriteria[field.name + 'Criteria']);
            return;
        }
        var searchFieldView;
        if (field.type == 'datetime'){
            var startDate = new Date();
            var endDate = new Date();
            startDate.setMonth(endDate.getMonth()-1);
            searchFieldView = new DatetimeRangeView({
                name : field.displayName,
                value : [startDate, endDate]
            });
        } else {
            searchFieldView = new SearchFieldView({
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
    };
	
    schema.fields['entries'].forEach(addSearchViewCallback, searchCriteria);

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
