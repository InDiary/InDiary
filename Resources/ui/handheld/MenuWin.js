/**
 * Window for adding a new entry or editing an existing one.
 * @param {Number} entryId Id of entry to be edited. -1 corresponds to a new entry.
 */
function MenuWin() {
    var util = require('util');
    var theme = require('ui/theme');
    var ToolbarView = require('ToolbarView');
    var DualLabelRow = require('DualLabelRow');
    var ListWin = require('ListWin');
    
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
        self.close(winOpenCloseArgs);
    });
    
    var borderView = Ti.UI.createView({
        width : Titanium.UI.FILL,
        height : 2,
        backgroundColor : theme.borderColor
    });
    self.add(borderView);

	var table = Ti.UI.createTableView({
	    separatorColor: theme.borderColor
	});
    self.add(table);
    
    table.setData([new DualLabelRow(L('entries'), '', {tableName: 'entries'}),
                   new DualLabelRow(L('cases'), '', {tableName: 'cases'})]);
    
    table.addEventListener('click', function(e) {
        if (typeof(e.rowData.win) != 'undefined'){
            new e.rowData.win().open(winOpenCloseArgs);
        } else {
            new ListWin(e.rowData.tableName).open(winOpenCloseArgs);
        }
        self.close(winOpenCloseArgs);
    });

    self.addEventListener('android:back', function(){
        self.close(winOpenCloseArgs);      
    });
    
    var winOpenCloseArgs = {
        activityEnterAnimation: Ti.Android.R.anim.fade_in,
        activityExitAnimation: Ti.App.Android.R.anim.push_left_out
    };
    
    return self;
};

module.exports = MenuWin;