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
    var fieldValues = ["'" + entryData.text + "'"];
    schema.fields.forEach(function(field) {
        fieldNames.push(field.name);
        var value = entryData[field.name];
        if (field.type == 'datetime'){
            value = value.toString();
        }
        value = "'" + value + "'";
        fieldValues.push(value);
    });
	db.execute('INSERT INTO entries (' + fieldNames.join(', ') + ') VALUES (' +  fieldValues.join(', ') + ')');
	db.close();
};

exports.editEntry = function(entryData) {
    var db = Ti.Database.open(DATABASE_NAME);
    var fieldNamesAndValues = ['text=' + "'" + entryData.text + "'"];
    schema.fields.forEach(function(field) {
        var value = entryData[field.name];
        if (field.type == 'datetime'){
            value = value.toString();
        }
        value = "'" + value + "'";
        fieldNamesAndValues.push(field.name + '=' + value);
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

exports.selectEntries = function() {
	var entriesData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute('SELECT * FROM entries ORDER BY id DESC');
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