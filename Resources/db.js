var util = require('util');
var schema = require('schema');
var DATABASE_NAME = 'InDiaryEntries';

exports.createDatabase = function(){
	var db = Ti.Database.open(DATABASE_NAME);
	var fieldNameAndTypes = [];
	schema.fields.forEach(function(field){
	   fieldNameAndTypes.push(field.name + ' TEXT');
	});
	db.execute('CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY, text TEXT, ' + fieldNameAndTypes.join(', ') + ')');
	db.close();
};

exports.deleteDatabase = function(){
	var db = Ti.Database.open(DATABASE_NAME);
	db.close();
	db.remove();
};

exports.addEntry = function(entryData) {
	var db = Ti.Database.open(DATABASE_NAME);
    var fieldNames = ['text'];
    var fieldValues = [util.quotify(entryData.text.replace(/'/g,"''"))];
    schema.fields.forEach(function(field) {
        fieldNames.push(field.name);
        var value = entryData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        fieldValues.push(util.quotify(value));
    });
	db.execute('INSERT INTO entries (' + fieldNames.join(', ') + ') VALUES (' +  fieldValues.join(', ') + ')');
	db.close();
};

exports.editEntry = function(entryData) {
    var db = Ti.Database.open(DATABASE_NAME);
    var fieldNamesAndValues = ['text=' + util.quotify(entryData.text.replace(/'/g,"''"))];
    schema.fields.forEach(function(field) {
        var value = entryData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        fieldNamesAndValues.push(field.name + '=' + util.quotify(value));
    });
    db.execute('UPDATE entries SET ' +  fieldNamesAndValues.join(', ') + ' WHERE id=?', entryData.id);
    db.close();
};

exports.selectEntry = function(id) {
    var db = Ti.Database.open(DATABASE_NAME);
    var rows = db.execute('SELECT * FROM entries WHERE id=?', id);
    db.close();
    if (rows.isValidRow()) {
        var entryData = {
            id : rows.fieldByName('id'),
            text : rows.fieldByName('text')
        };
        schema.fields.forEach(function(field) {
            var value = rows.fieldByName(field.name);
            if (field.type == 'datetime') {
                entryData[field.name] = new Date(value); 
            } else {
                entryData[field.name] = value;
            }
        });
        return entryData;
    } else {
        return false;
    }
};

exports.selectEntries = function(searchCriteria) {
    var orderBy = (typeof(searchCriteria.orderBy) === 'undefined') ? 'id' : searchCriteria.orderBy;
    var ascending = (typeof(searchCriteria.ascending) === 'undefined') ? false : searchCriteria.ascending;
    var ascText = (ascending) ? 'ASC' : 'DESC';
    
    var escapeChar = '~';
    var matchRe = new RegExp('[%_' + escapeChar + ']','g');
    
    var matchFieldsAndValues = [];
    var rangeFieldsAndValues = [];
    
    var fieldNames = ['text'];
    schema.fields.forEach(function(field) {
        fieldNames.push(field.name);
    });
    fieldNames.forEach(function(field) {
        var value = searchCriteria[field];
        if (typeof(value) !== 'undefined') {
            value = util.quotify(value.replace(matchRe, escapeChar + '$&'),'%');
            matchFieldsAndValues.push(field + ' LIKE ' + util.quotify(value.replace(/'/g, "''")));
        }
        var range = searchCriteria[field + 'Range'];
        if (typeof (range) !== 'undefined') {
            rangeFieldsAndValues.push(field + ' BETWEEN ' + util.quotify(range[0]) + ' AND ' + util.quotify(range[1]));
        }
    });
    var matchText = matchFieldsAndValues.join(' AND ');
    var rangeText = rangeFieldsAndValues.join(' AND '); 
	var whereText = '';
	if (matchText != '' && rangeText != ''){
	    whereText = 'WHERE ' + rangeText + ' AND ' + matchText + ' ESCAPE ' + util.quotify(escapeChar) + ' ';
	} else if (matchText != '') {
        whereText = 'WHERE ' + matchText + ' ESCAPE ' + util.quotify(escapeChar) + ' ';	    
	} else if (rangeText != '') {
        whereText = 'WHERE ' + rangeText + ' ';	    
	}
	
	var entriesData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM entries ' + whereText + 'ORDER BY ' + orderBy + ' ' + ascText);
	db.close();
	while (rows.isValidRow()) {
		var	entryData = {
		    id : rows.fieldByName('id'),
		    text : rows.fieldByName('text')
		};
        schema.fields.forEach(function(field) {
            var value = rows.fieldByName(field.name);
            if (field.type == 'datetime') {
                entryData[field.name] = new Date(value); 
            } else {
                entryData[field.name] = value;
            }
        }); 
		entriesData.push(entryData);
		rows.next();
	}
	return entriesData;
};