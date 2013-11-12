/**
 * Window for adding a new entry or editing an existing one.
 * @param {Number} entryId Id of entry to be edited. -1 corresponds to a new entry.
 */
function MenuWin() {
    var util = require('util');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var DualLabelRow = require('DualLabelRow');
    var EntryListWin = require('EntryListWin');
    var CaseListWin = require('CaseListWin');
    
    var self = Ti.UI.createWindow({
        navBarHidden: true,
        backgroundColor : theme.backgroundColor,
        layout : 'vertical'
    });

    var toolbarView = new ToolbarView();
    self.add(toolbarView);

    var barIcon = toolbarView.addBarIcon('/images/appicon.png', 
                                         '/images/up.png');
	var titleLabel = toolbarView.addLabel(L('InDiary'));

    barIcon.addEventListener('click', function(e) {
        self.close();
    });
    
    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
    });
    self.add(borderView);

	var table = Ti.UI.createTableView();
    self.add(table);
    
    table.setData([new DualLabelRow(L('entries'), '', {win: EntryListWin}),
                   new DualLabelRow(L('cases'), '', {win: CaseListWin})]);
    
    table.addEventListener('click', function(e) {
        new e.rowData.win().open();
        self.close();
    });
    
    return self;
};

module.exports = MenuWin;