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
	self.toolbarFull = false;

	self.addButton = function(buttonImage) {
		var button = Ti.UI.createButton({
			top : '3dp',
			right : 3 + 45 * self.numButtons + 'dp',
			width : '42dp',
			height : '42dp',
			backgroundImage : buttonImage,
			backgroundSelectedColor : theme.toolbarBackgroundSelectedColor
		});
		self.add(button);
		self.numButtons++;
		self.fireEvent('buttonAdded');
		return button;
	};
	
	self.addTextField = function(text, hintText, hideFirstKeyboard) {
		if (self.toolbarFull)
			return false;
		var textField = Ti.UI.createTextField({
			top : '6dp',
			left : '3dp',
			right : 3 + 45 * self.numButtons + 'dp',
			height : '42dp',
			backgroundColor : theme.toolbarBackgroundColor,
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
		self.labelOrTextField = textField;
		return textField;
	};

	self.addLabel = function(text) {
		if (self.toolbarFull)
			return false;
		var label = Ti.UI.createLabel({
			top : '3dp',
			height : '42dp',
			left : '11dp',
			right : '48dp',
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
		self.labelOrTextField = label;
		return label;
	};

	self.addEventListener('buttonAdded', function(e){
		if (self.toolbarFull){
			self.labelOrTextField.right = 3 + 45 * self.numButtons + 'dp';
		}
	});

	return self;
};

module.exports = ToolbarView;