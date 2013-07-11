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
		title:L('entries'),
		backgroundColor:'black',
		layout: 'vertical',
		navBarHidden: true
	});
	
    var toolbarView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : '48dp'
    });
    self.add(toolbarView);

    var winLabel = Ti.UI.createLabel({
        top : '6dp',
        left : '12dp',
        right : '93dp',
        height : '42dp',
        backgroundColor : 'black',
        color : 'white',
        textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
        font : {
            fontSize : '18dp'
        },
        text : L('searchOptions')
    });
    toolbarView.add(winLabel);

    var cancelButton = Ti.UI.createButton({
        top : '3dp',
        right : '48dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/cancel.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(cancelButton);
    cancelButton.addEventListener('click', function(e) {
        self.close();
    });

    var searchButton = Ti.UI.createButton({
        top : '3dp',
        right : '3dp',
        width : '42dp',
        height : '42dp',
        backgroundImage : '/images/search.png',
        backgroundSelectedColor : '#BBBBBB'
    });
    toolbarView.add(searchButton);
    
	var borderView = Ti.UI.createView({
		width: Titanium.UI.FILL,
		height: 2,
		backgroundColor: '#444444'
	});
	self.add(borderView);

   var textSearchInfoView = new SearchInfoView({
        type : 'text',
        name : 'Entry text',
        value : '',
        hintText : 'Entry text'
    });
    self.add(textSearchInfoView);
    self.add(Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 1,
        backgroundColor : '#444444'
    }));
	
    schema.fields.forEach(function(field) {
       var searchInfoView = new SearchInfoView({
            type : field.type,
            name : field.displayName,
            value : '',
            hintText : field.hintText
        });
        self.add(searchInfoView);
        self.add(Ti.UI.createView({
            width : Titanium.UI.FILL,
            height : 1,
            backgroundColor : '#444444'
        }));
    });

	return self;
};

module.exports = SearchWin;
