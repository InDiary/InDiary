function DialogWin(parent, title, dialogView) {
    var theme = require('theme');
    
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
        backgroundColor: theme.borderColor,
    });
    self.add(dialogBorder);

    dialogBorder.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
    }));

    var dialog = Ti.UI.createView({
        left : 1,
        right : 1,
        height : Ti.UI.SIZE,
        layout : 'vertical',
        backgroundColor : 'black',
        color : theme.primaryTextColor
    }); 
    dialogBorder.add(dialog);

    dialogBorder.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 1,
        backgroundColor : theme.borderColor
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
            fontSize: theme.primaryFontSize
        },
        text: title,
        color: theme.primaryTextColor
    });
	titleBar.add(titleLabel);
	
    dialog.add(Ti.UI.createView({
        width : Ti.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
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
        backgroundColor : theme.borderColor
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
	   backgroundSelectedColor : theme.selectedBackgroundColor
	});
	buttonBar.add(setButton);
	var setLabel = Ti.UI.createLabel({
	    center : {x: '50%', y: '50%'},
	    color : theme.primaryTextColor,
        font : {
            fontSize: theme.secondaryFontSize
        },
        text: L('set'),
        touchEnabled: false
    });
    setButton.add(setLabel);
    var rightBorder = Ti.UI.createView({
        right : '0dp',
        height : '100%',
        width : 1,
        backgroundColor : theme.borderColor
    }); 
    setButton.add(rightBorder);
    setButton.addEventListener('click', function(e){
       parent.fireEvent('dialog:done', {set: true});
       self.close();
    });
	
	var cancelButton = Ti.UI.createView({
       height: '100%',
       width: '50%',
       backgroundSelectedColor : theme.selectedBackgroundColor
    });
    buttonBar.add(cancelButton);
    var cancelLabel = Ti.UI.createLabel({
        center : {x: '50%', y: '50%'},
        color : theme.primaryTextColor,
        font : {
            fontSize: theme.secondaryFontSize
        },
        text: L('cancel'),
        touchEnabled: false
    });
    cancelButton.add(cancelLabel);
    var leftBorder = Ti.UI.createView({
        left : '0dp',
        height : '100%',
        width : 1,
        backgroundColor : theme.borderColor
    }); 
    cancelButton.add(leftBorder);
    cancelButton.addEventListener('click', function(e){
       parent.fireEvent('dialog:done', {set: false});
       self.close();
    });
	
	return self;
};

module.exports = DialogWin;
