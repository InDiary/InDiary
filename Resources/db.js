var util = require('util');
var schema = require('schema');
var ENTRIES_DATABASE_NAME = 'InDiaryEntries';
var CASES_DATABASE_NAME = 'InDiaryCases';

exports.createEntriesDatabase = function(){
	var db = Ti.Database.open(ENTRIES_DATABASE_NAME);
	var fieldNameAndTypes = [];
	schema.entryFields.forEach(function(field){
	   fieldNameAndTypes.push(field.name + ' TEXT');
	});
	db.execute('CREATE TABLE IF NOT EXISTS entries(id INTEGER PRIMARY KEY, ' + fieldNameAndTypes.join(', ') + ')');
	db.close();
};

exports.deleteEntriesDatabase = function(){
	var db = Ti.Database.open(ENTRIES_DATABASE_NAME);
	db.close();
	db.remove();
};

exports.addEntry = function(entryData) {
	var db = Ti.Database.open(ENTRIES_DATABASE_NAME);
    var fieldNames = [];
    var fieldValues = [];
    schema.entryFields.forEach(function(field) {
        fieldNames.push(field.name);
        var value = entryData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        fieldValues.push(util.quotify(value.replace(/'/g,"''")));
    });
	db.execute('INSERT INTO entries (' + fieldNames.join(', ') + ') VALUES (' +  fieldValues.join(', ') + ')');
	db.close();
};

exports.editEntry = function(entryData) {
    var db = Ti.Database.open(ENTRIES_DATABASE_NAME);
    var fieldNamesAndValues = [];
    schema.entryFields.forEach(function(field) {
        var value = entryData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        fieldNamesAndValues.push(field.name + '=' + util.quotify(value.replace(/'/g,"''")));
    });
    db.execute('UPDATE entries SET ' +  fieldNamesAndValues.join(', ') + ' WHERE id=?', entryData.id);
    db.close();
};

exports.selectEntry = function(id) {
    var db = Ti.Database.open(ENTRIES_DATABASE_NAME);
    var rows = db.execute('SELECT * FROM entries WHERE id=?', id);
    db.close();
    if (rows.isValidRow()) {
        var entryData = {
            id : rows.fieldByName('id')
        };
        schema.entryFields.forEach(function(field) {
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
    
    schema.entryFields.forEach(function(field) {
        var value = searchCriteria[field.name];
        if (typeof(value) !== 'undefined') {
            value = util.quotify(value.replace(matchRe, escapeChar + '$&'),'%');
            matchFieldsAndValues.push(field.name + ' LIKE ' + util.quotify(value.replace(/'/g, "''")));
        }
        var range = searchCriteria[field.name + 'Range'];
        if (typeof (range) !== 'undefined') {
            if (field.type == 'datetime') {
                range = [range[0].toISOString(), range[1].toISOString()]
            }
            rangeFieldsAndValues.push(field.name + ' BETWEEN ' + util.quotify(range[0]) + ' AND ' + util.quotify(range[1]));
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
	var db = Ti.Database.open(ENTRIES_DATABASE_NAME);
	var rows = db.execute('SELECT * FROM entries ' + whereText + 'ORDER BY ' + orderBy + ' ' + ascText);
	db.close();
	while (rows.isValidRow()) {
		var	entryData = {
		    id : rows.fieldByName('id')
		};
        schema.entryFields.forEach(function(field) {
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

exports.createCasesDatabase = function(){
	var db = Ti.Database.open(CASES_DATABASE_NAME);
	db.execute('CREATE TABLE IF NOT EXISTS caes(id INTEGER PRIMARY KEY, name TEXT)');
	db.close();
};

exports.deleteCasesDatabase = function(){
	var db = Ti.Database.open(CASES_DATABASE_NAME);
	db.close();
	db.remove();
};

exports.addCase = function(caseData) {
	var db = Ti.Database.open(CASES_DATABASE_NAME);
    db.execute('INSERT INTO cases (name) VALUES (' +  caseData.name + ')');
	db.close();
};

exports.selectCase = function(id) {
    var db = Ti.Database.open(CASES_DATABASE_NAME);
    var rows = db.execute('SELECT * FROM cases WHERE id=?', id);
    db.close();
    if (rows.isValidRow()) {
        var caseData = {
            id : rows.fieldByName('id'),
            name : rows.fieldByName('name')
        };
        return caseData;
    } else {
        return false;
    }
};
