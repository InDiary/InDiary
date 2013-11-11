/**
 * Toolbar with buttons that resides on the top of each window.
 */
function ToolbarView() {
	var theme = require('ui/theme');

	var self = Ti.UI.createView({
		top: '0dp',
		left: '0dp',
		width : Ti.UI.FILL,
		height : '48dp',
		backgroundColor : theme.toolbarBackgroundColor
	});

	self.numButtons = 0;
	self.hasBarIcon = false;
	self.toolbarFull = false;

	self.addButton = function(buttonImage) {
		var button = Ti.UI.createView({
			top : '0dp',
			right : 56 * self.numButtons + 'dp',
			width : '56dp',
			height : '48dp',
			backgroundColor : theme.toolbarBackgroundColor,
			backgroundSelectedColor : theme.toolbarBackgroundSelectedColor
		});
		self.add(button);
		var imageView = Ti.UI.createView({
            width : '32dp',
            height : '32dp',
            backgroundImage : buttonImage,
            touchEnabled : false
		});
		button.add(imageView);
		self.numButtons++;
		self.fireEvent('buttonAdded');
		return button;
	};

    self.addBarIcon = function(barIconImage, navImage) {
        if (self.hasBarIcon)
            return false;
        var containerView = Ti.UI.createView({
            top : '0dp',
            left : '0dp',
            width : '44dp',
            height : '48dp',
            backgroundColor : theme.toolbarBackgroundColor,
            backgroundSelectedColor : theme.toolbarBackgroundSelectedColor
        });
        self.add(containerView);
        var imageView = Ti.UI.createView({
            left : '12dp',
            width : '32dp',
            height : '32dp',
            backgroundImage : barIconImage,
            touchEnabled : false
        });
        containerView.add(imageView);
        if (typeof(navImage) != 'undefined'){
            var navImageView = Ti.UI.createView({
                left : '0dp',
                width : '16dp',
                height : '16dp',
                backgroundImage : navImage,
                touchEnabled : false
            });
            containerView.add(navImageView);
        }
        self.hasBarIcon = true;
        self.fireEvent('barIconAdded');
        return containerView;
    };
	
	self.addTextField = function(text, hintText, hideFirstKeyboard) {
		if (self.toolbarFull)
			return false;
		var textField = Ti.UI.createTextField({
			top : '6dp',
			left : 4 + self.hasBarIcon * 36 + 'dp',
			right : 56 * self.numButtons + 'dp',
			height : '42dp',
			backgroundColor : 'transparent',
			color : theme.primaryToolbarTextColor,
			font : {
				fontSize : theme.toolbarFontSize
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			value : text,
			hintText : hintText,
			ellipsize : true
		});
		if (hideFirstKeyboard) {
		    textField.justCreated = true;
		    textField.addEventListener('focus', function f(e){
                if (textField.justCreated) {
                    textField.justCreated = false;
                    textField.blur();
                } else {
                    textField.removeEventListener('focus', f);
                }
            });
		}
		self.add(textField);
		self.toolbarFull = true;
		self.textElement = textField;
		return textField;
	};

	self.addLabel = function(text) {
		if (self.toolbarFull)
			return false;
		var label = Ti.UI.createLabel({
			top : '3dp',
			height : '42dp',
			left : 12 + self.hasBarIcon * 36 + 'dp',
			right : 56 * self.numButtons + 'dp',
			color : theme.primaryToolbarTextColor,
			font : {
				fontSize : theme.toolbarFontSize 
			},
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			text : text,
			ellipsize : true
		});
		self.add(label);
		self.toolbarFull = true;
		self.textElement = label;
		return label;
	};

	self.addEventListener('buttonAdded', function(e){
		if (self.toolbarFull){
			self.textElement.right = 56 * self.numButtons + 'dp';
		}
	});

    self.addEventListener('barIconAdded', function(e){
        if (self.toolbarFull){
            var oldLeft = Number(self.textElement.left.slice(0,-2));
            self.textElement.left = oldLeft + 36 + 'dp';
        }
    });

	return self;
};

module.exports = ToolbarView;