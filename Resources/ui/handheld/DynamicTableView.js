/**
 * @classdesc A table view with a dynamic section layout.
 * @param {Object} vars Object containing EntryInfoView properties.
 * @property {Array} sections Array of sections that make up table view.
 * @property {Object} rowTemplate Prototype row properties.
 * @property {Object} headerRowTemplate Prototype section header row properties.
 */
function DynamicTableView(vars) {
    var theme = require('ui/theme');

    var self = Ti.UI.createTableView(vars);
    if (typeof(self.dynamicSections) === 'undefined'){
        self.dynamicSections = [];
    }
    if (typeof(self.rowTemplate) === 'undefined'){
        self.rowTemplate = {
            color : theme.primaryTextColor,
            backgroundSelectedColor : theme.backgroundSelectedColor,
            height : '48dp',
            font : {
                fontSize : theme.toolbarFontSize
            }
        };
    }
    self.rowTemplate.selectable = true; 
    if (typeof(self.headerRowTemplate) === 'undefined'){
        self.headerRowTemplate = {
            color : theme.primaryTextColor,
            backgroundColor: theme.borderColor,
            backgroundSelectedColor: theme.borderColor,
            height : '22dp',
            font : {
                fontSize : theme.secondaryFontSize
            }
        };
    }
    self.headerRowTemplate.selectable = false; 
    
    self.addDynamicSection = function(title) {
        var newSection = {
            title : title,
            visible : false,
            rows: [],
            headerRow: Ti.UI.createTableViewRow(self.headerRowTemplate)
        };
        newSection.headerRow.title = title;
        newSection.addRow = function(rowTitle, otherProps) {
            var rowProps = self.rowTemplate;
            for (var propName in otherProps){
                rowProps[propName] = otherProps[propName];
            }
            var row = Ti.UI.createTableViewRow(rowProps);
            row.title = rowTitle;
            newSection.rows.push(row);
            return row;
        };
        self.dynamicSections.push(newSection);
        return newSection;
    };

    self.reset = function() {
        var data = [];
        for (i = 0; i < self.dynamicSections.length; i++){
            self.dynamicSections[i].visible = false;
            self.dynamicSections[i].rows = [];
        }
        self.setData(data);
    };

    self.update = function() {
        var data = [];
        for (i = 0; i < self.dynamicSections.length; i++){
            if (self.dynamicSections[i].visible){
                data.push(self.dynamicSections[i].headerRow);
                data = data.concat(self.dynamicSections[i].rows);
            }
        }
        self.setData(data);
    };

    return self;
};

module.exports = DynamicTableView;