function SearchWin() {
	var util = require('util');
    var schema = require('schema');
	var SearchInfoView = require('SearchInfoView');
    
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
        self.close();
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
        width : Ti.UI.FILL
    });
    self.add(moreView);
	
    schema.fields.forEach(function(field) {
       var searchInfoView = new SearchInfoView({
            type : field.type,
            name : field.displayName,
            value : '',
            hintText : field.hintText
        });
        moreView.add(searchInfoView);
        moreView.add(Ti.UI.createView({
            width : Ti.UI.FILL,
            height : 1,
            backgroundColor : '#444444'
        }));
    });

	return self;
};

module.exports = SearchWin;
