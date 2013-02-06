function DialogWin(parent, title, dialogView) {
    var self = Ti.UI.createWindow({
        opacity : 0,
        modal : true,
        navBarHidden: true
    });

    var dialogBorder = Ti.UI.createView({
        height : Ti.UI.SIZE,
        width : '90%',
        center : {x: '50%', y: '50%'},
        layout : 'vertical',
        backgroundColor: '#444444',
    });
    self.add(dialogBorder);

    dialogBorder.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 1,
        backgroundColor : '#444444'
    }));

    var dialog = Ti.UI.createView({
        left : 1,
        right : 1,
        height : Ti.UI.SIZE,
        layout : 'vertical',
        backgroundColor : 'black',
        color : 'white'
    }); 
    dialogBorder.add(dialog);

    dialogBorder.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 1,
        backgroundColor : '#444444'
    }));

    var titleBar = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '56dp',
        layout : 'horizontal'
    });
    dialog.add(titleBar);    
    var titleLabel = Ti.UI.createLabel({
        top: '12dp',
        left: '11dp',
        font : {
            fontSize: '24dp'
        },
        text: title,
        color: 'white'
    });
	titleBar.add(titleLabel);
	
    dialog.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 2,
        backgroundColor : '#444444'
    }));
    dialog.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '10dp'
    }));
    
    dialog.add(dialogView);

    dialog.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '10dp'
    }));
    dialog.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 2,
        backgroundColor : '#444444'
    }));
    
    var buttonBar = Ti.UI.createView({
        width : Ti.UI.FILL,
        height : '48dp',
        layout : 'horizontal'
    });
	dialog.add(buttonBar);
	
	var setButton = Ti.UI.createView({
       height: '100%',
	   width: '50%',
	   backgroundSelectedColor : '#BBBBBB'
	});
	buttonBar.add(setButton);
	var setLabel = Ti.UI.createLabel({
	    center : {x: '50%', y: '50%'},
	    color : 'white',
        font : {
            fontSize: '16dp'
        },
        text: L('set'),
        touchEnabled: false
    });
    setButton.add(setLabel);
    var rightBorder = Ti.UI.createView({
        right : '0dp',
        height : '100%',
        width : 1,
        backgroundColor : '#444444'
    }); 
    setButton.add(rightBorder);
    setButton.addEventListener('click', function(e){
       parent.fireEvent('dialog:done', {set: true});
       self.close();
    });
	
	var cancelButton = Ti.UI.createView({
       height: '100%',
       width: '50%',
       backgroundSelectedColor : '#BBBBBB'
    });
    buttonBar.add(cancelButton);
    var cancelLabel = Ti.UI.createLabel({
        center : {x: '50%', y: '50%'},
        color : 'white',
        font : {
            fontSize: '15dp'
        },
        text: L('cancel'),
        touchEnabled: false
    });
    cancelButton.add(cancelLabel);
    var leftBorder = Ti.UI.createView({
        left : '0dp',
        height : '100%',
        width : 1,
        backgroundColor : '#444444'
    }); 
    cancelButton.add(leftBorder);
    cancelButton.addEventListener('click', function(e){
       parent.fireEvent('dialog:done', {set: false});
       self.close();
    });
	
	return self;
};

module.exports = DialogWin;
