/**
 * View that overlays EntryListWin with search bar and advanced search options.
 */
function DataSearchView(tableName, obj) {
	var util = require('util');
    var schema = require('schema');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var DatetimeRangeView = require('DatetimeRangeView');
	var SearchFieldView = require('SearchFieldView');
    
    var searchCriteria = {
        orderBy: schema.metadata[tableName].orderBy,
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
		visible: false,
		opacity: 0
	});
    
    var toolbarView = new ToolbarView();
    self.add(toolbarView);

    var searchBarField = '';
    var searchHintText = '';
    schema.fields[tableName].forEach(function(field) {
        if (field.showInToolbar){
            searchBarField = field.name;
            searchHintText = field.searchHintText;
        }
    });    
    
    var searchBar = toolbarView.addTextField('', searchHintText);
	searchBar.softKeyboardOnFocus = Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS;
	searchBar.addEventListener('change', function(e) {
		searchCriteria[searchBarField] = e.value;
		self.fireEvent('change');
	});

	var cancelButton = toolbarView.addButton('/images/cancel.png');
	var moreButton = toolbarView.addButton(['/images/more.png',
                                            '/images/less.png']);

    cancelButton.addEventListener('click', function(e) {
        searchBar.blur();
        self.animate({opacity: 0, duration: 250});
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

    var moreView = Ti.UI.createScrollView({
        width : Ti.UI.FILL,
        height : Ti.UI.FILL,
        contentHeight : Ti.UI.SIZE,
        layout : 'vertical',
        visible : false
    });
    self.add(moreView);
	
	var addSearchViewCallback = function(field) {
        var searchCriteria = this;
        if (field.showInToolbar)
            return;
        if (field.type == 'list')
            return;
        if (field.type == 'id'){
            searchCriteria[field.name + 'Criteria'] = {};
            schema.fields[field.tableName].
                forEach(addSearchViewCallback,
                        searchCriteria[field.name + 'Criteria']);
            return;
        }
        var containerView = Ti.UI.createView({
            left : '7.5dp',
            right : '7.5dp',
            height : Ti.UI.SIZE,
            layout : 'vertical'
        });
        moreView.add(containerView);
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
        containerView.add(searchFieldView);
        containerView.add(Ti.UI.createView({
            width : Ti.UI.FILL,
            height : 1,
            backgroundColor : theme.borderColor
        }));
    };
	
    schema.fields[tableName].forEach(addSearchViewCallback, searchCriteria);

	self.addEventListener('open', function(e){
		self.visible = true;
		self.animate({opacity: 1, duration: 250});
		searchBar.focus();
	});

	self.addEventListener('change', function(e) {
		obj.fireEvent('search', {searchCriteria: searchCriteria});
	});

	return self;
};

module.exports = DataSearchView;
