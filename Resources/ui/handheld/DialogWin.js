function DialogWin(parent, title, dialogView) {
    var theme = require('ui/theme');
    
    var self = Ti.UI.createWindow({
        navBarHidden : true,
        backgroundColor : 'transparent',
        opacity : 1.0
    });
    
    self.add(Ti.UI.createView({
        height : Ti.UI.FILL,
        width : Ti.UI.FILL,
        backgroundColor : 'black',
        opacity : 0.75
    }));

    var dialog = Ti.UI.createView({
        height : Ti.UI.SIZE,
        width : '90%',
        center : {x: '50%', y: '50%'},
        layout : 'vertical',
        color : theme.primaryTextColor,
        backgroundColor : theme.backgroundColor,
        zindex : 1,
        borderWidth : 1,
        borderRadius : 4,
        borderColor : theme.borderColor,
    });
    self.add(dialog);

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
    
    dialog.add(dialogView);

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
	   backgroundSelectedColor : theme.backgroundSelectedColor
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
        self.close(closeArgs);
    });
	
	var cancelButton = Ti.UI.createView({
       height: '100%',
       width: '50%',
       backgroundSelectedColor : theme.backgroundSelectedColor
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
        self.close(closeArgs);
    });
	
	self.addEventListener('android:back', function(){
        self.close(closeArgs);	    
    });

    var closeArgs = {activityExitAnimation: Ti.App.Android.R.anim.expand_out};
	
	return self;
};

module.exports = DialogWin;
