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

exports.selectEntries = function(orderBy, filterFields, filterValues, ascending) {
    if (typeof (orderBy) === 'undefined')
        orderBy = 'id';
    if (typeof (filterFields) === 'undefined')
        filterFields = [];
    if (typeof (filterValues) === 'undefined')
        filterValues = [];
    if (typeof (ascending) === 'undefined' )
        ascending = false;
    if (filterFields.length != filterValues.length)
        return false;
	var entriesData = [];
	if (ascending){
	    var ascText = 'ASC'
	} else {
	    var ascText = 'DESC'
	}
	var escapeChar = '~';
    var filterRe = new RegExp('[%_' + escapeChar + ']','g');
	var filterFieldsAndValues = [];
	for (var i=0; i<filterFields.length; i++){
	    var filterPattern = util.quotify(filterValues[i].replace(filterRe, escapeChar + '$&'),'%');
	    filterFieldsAndValues.push(filterFields[i] + ' LIKE ' + util.quotify(filterPattern.replace(/'/g, "''")));
	}
	var filterText = filterFieldsAndValues.join(' AND ');
	if (filterText != ''){
	    filterText = 'WHERE ' + filterText + ' ESCAPE ' + util.quotify(escapeChar) + ' ';
	}
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM entries ' + filterText + 'ORDER BY ' + orderBy + ' ' + ascText);
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