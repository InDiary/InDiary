var util = require('util');
var schema = require('schema');
var DATABASE_NAME = 'InDiaryMain'

exports.createDatabase = function(){
	var db = Ti.Database.open(DATABASE_NAME);
    ['entries', 'cases'].forEach(function(tableName) {
        var fieldNameAndTypes = [];
        schema.fields[tableName].forEach(function(field){
           fieldNameAndTypes.push(field.name + ' TEXT');
        });
        db.execute('CREATE TABLE IF NOT EXISTS ' + tableName + 
                   '(id INTEGER PRIMARY KEY, ' + 
                   fieldNameAndTypes.join(', ') + ')');
    });
	db.close();
};

exports.deleteDatabase = function(){
	var db = Ti.Database.open(DATABASE_NAME);
	db.close();
	db.remove();
};

exports.addRow = function(tableName, rowData) {
	var db = Ti.Database.open(DATABASE_NAME);
    var fieldNames = [];
    var fieldValues = [];
    schema.fields[tableName].forEach(function(field) {
        fieldNames.push(field.name);
        var value = rowData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        fieldValues.push(util.quotify(value.replace(/'/g,"''")));
    });
	db.execute('INSERT INTO ' + tableName + ' (' +
               fieldNames.join(', ') + ') VALUES (' + 
               fieldValues.join(', ') + ')');
	db.close();
};

exports.editRow = function(tableName, rowData) {
    var db = Ti.Database.open(DATABASE_NAME);
    var fieldNamesAndValues = [];
    schema.fields[tableName].forEach(function(field) {
        var value = rowData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        fieldNamesAndValues.push(field.name + '=' + 
                                 util.quotify(value.replace(/'/g,"''")));
    });
    db.execute('UPDATE ' + tableName + ' SET ' +
               fieldNamesAndValues.join(', ') + ' WHERE id=?', rowData.id);
    db.close();
};

exports.selectRow = function(tableName, id) {
    var db = Ti.Database.open(DATABASE_NAME);
    var rows = db.execute('SELECT * FROM ' + tableName + ' WHERE id=?', id);
    db.close();
    if (rows.isValidRow()) {
        var rowData = {
            id : rows.fieldByName('id')
        };
        schema.fields[tableName].forEach(function(field) {
            var value = rows.fieldByName(field.name);
            if (field.type == 'datetime') {
                rowData[field.name] = new Date(value); 
            } else {
                rowData[field.name] = value;
            }
        });
        return rowData;
    } else {
        return false;
    }
};

exports.selectRows = function(tableName, searchCriteria) {
    var orderBy = (typeof(searchCriteria.orderBy) === 'undefined') ? 
        'id' : searchCriteria.orderBy;
    var ascending = (typeof(searchCriteria.ascending) === 'undefined') ? 
        false : searchCriteria.ascending;
    var ascText = (ascending) ? 'ASC' : 'DESC';
    
    var escapeChar = '~';
    var matchRe = new RegExp('[%_' + escapeChar + ']','g');
    
    var matchFieldsAndValues = [];
    var rangeFieldsAndValues = [];
    
    schema.fields[tableName].forEach(function(field) {
        var value = searchCriteria[field.name];
        if (typeof(value) !== 'undefined') {
            value = util.quotify(value.replace(matchRe, escapeChar + '$&'),'%');
            matchFieldsAndValues.push(field.name + ' LIKE ' + 
                                      util.quotify(value.replace(/'/g, "''")));
        }
        var range = searchCriteria[field.name + 'Range'];
        if (typeof (range) !== 'undefined') {
            if (field.type == 'datetime') {
                range = [range[0].toISOString(), range[1].toISOString()]
            }
            rangeFieldsAndValues.push(field.name + ' BETWEEN ' +
                                      util.quotify(range[0]) + ' AND ' + 
                                      util.quotify(range[1]));
        }
    });
    var matchText = matchFieldsAndValues.join(' AND ');
    var rangeText = rangeFieldsAndValues.join(' AND '); 
	var whereText = '';
	if (matchText != '' && rangeText != ''){
	    whereText = 'WHERE ' + rangeText + ' AND ' + matchText + ' ESCAPE ' + 
                    util.quotify(escapeChar) + ' ';
	} else if (matchText != '') {
        whereText = 'WHERE ' + matchText + ' ESCAPE ' + 
                    util.quotify(escapeChar) + ' ';
	} else if (rangeText != '') {
        whereText = 'WHERE ' + rangeText + ' '; 
	}
    
	var rowsData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM ' + tableName + ' ' + whereText +
                          'ORDER BY ' + orderBy + ' ' + ascText);
	db.close();
	while (rows.isValidRow()) {
		var	rowData = {
		    id : rows.fieldByName('id')
		};
        schema.fields[tableName].forEach(function(field) {
            var value = rows.fieldByName(field.name);
            if (field.type == 'datetime') {
                rowData[field.name] = new Date(value); 
            } else {
                rowData[field.name] = value;
            }
        }); 
		rowsData.push(rowData);
		rows.next();
	}
	return rowsData;
};
