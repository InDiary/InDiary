function SearchWin(parent) {t
	var util = require('util');
    var schema = require('schema');
	var SearchFieldView = require('SearchFieldView');
    
    var searchCriteria = {
        orderBy: 'datetime',
        ascending: false,
        text: ''
    };

    var self = Ti.UI.createWindow({
		opacity: 0,
		layout: 'vertical',
        modal : true,
		navBarHidden: true
	});
    
    var toolbarView = Ti.UI.createView({
		backgroundColor : 'black',
        width : Ti.UI.FILL,
        height : '48dp'
    });
    self.add(toolbarView);

    var searchBar = Ti.UI.createTextField({
		top: '4dp',
		height: '42dp',
		left: '3dp',
		right: '93dp',
		backgroundColor : 'black',
        color : 'white',
		hintText: L('searchEntries')
	});
	searchBar.addEventListener('change', function(e) {
		searchCriteria['text'] = e.value;
		self.fireEvent('change');
	});
	toolbarView.add(searchBar);
	    
    var moreButton = Ti.UI.createButton({
        top : '3dp',
        right : '42dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/settings.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(moreButton);
    moreButton.addEventListener('click', function(e) {
        moreView.visible = !moreView.visible;
    });

    var cancelButton = Ti.UI.createButton({
        top : '3dp',
        right : '3dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/cancel.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(cancelButton);
    cancelButton.addEventListener('click', function(e) {
        self.close();
    });
    
	var borderView = Ti.UI.createView({
		width: Ti.UI.FILL,
		height: 2,
		backgroundColor: '#444444'
	});
	self.add(borderView);

    var moreView = Ti.UI.createView({
		layout: 'vertical',
        backgroundColor : 'black',
        height: Ti.UI.SIZE,
        width : Ti.UI.FILL,
        visible: false
    });
    self.add(moreView);
	
    schema.fields.forEach(function(field) {
       var searchFieldView = new SearchFieldView({
            type : field.type,
            name : field.displayName,
            value : '',
            hintText : field.hintText
        });
        searchFieldView.addEventListener('change', function(e) {
        	searchCriteria[field.name] = searchFieldView.value;
        	self.fireEvent('change');
        });
        moreView.add(searchFieldView);
        moreView.add(Ti.UI.createView({
            width : Ti.UI.FILL,
            height : 1,
            backgroundColor : '#444444'
        }));
    });

	self.addEventListener('change', function(e) {
		parent.fireEvent('search', {searchCriteria: searchCriteria});
	});

	return self;
};

module.exports = SearchWin;
