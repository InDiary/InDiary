/**
 * TableViewRow with primary and secondary text labels.
 */
function DualLabelRow(primaryText, secondaryText, otherProps, className) {
    if ( typeof (otherProps) === 'undefined' )
        otherProps = {};
    if ( typeof (className) === 'undefined' )
        className = 'DualLabelRow';
    
    var theme = require('ui/theme');
    
    var props = {
        height : '61dp',
        backgroundColor: theme.backgroundColor,
        backgroundSelectedColor: theme.backgroundSelectedColor,
        className : className
    };
    for (var propName in otherProps){props[propName] = otherProps[propName];}
    
    var self = Ti.UI.createTableViewRow(props);
    
    var primaryLabel = Ti.UI.createLabel({
        top: '7dp',
        left: '11dp',
        right: '11dp',
        width: Ti.UI.FILL,
        text: primaryText,
        color: theme.primaryTextColor,
        font: {
            fontSize: theme.primaryFontSize
        },
        wordWrap: false,
        ellipsize: true,
        touchEnabled: false
    });
    self.add(primaryLabel);
    
    var secondaryLabel = Ti.UI.createLabel({
        top: '37dp',
        bottom: '5dp',
        left: '11dp',
        right: '11dp',
        width: Ti.UI.FILL,
        text: secondaryText,
        color: theme.secondaryTextColor,
        font: {
            fontSize: theme.secondaryFontSize
        },
        wordWrap: false,
        ellipsize: true,
        touchEnabled: false
    });
    self.add(secondaryLabel);
    
    return self;
};

module.exports = DualLabelRow;