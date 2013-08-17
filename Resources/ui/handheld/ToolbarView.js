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
		return button;
	};

	return self;
};

module.exports = ToolbarView;