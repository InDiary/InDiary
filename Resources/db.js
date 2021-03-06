var util = require('util');
var schema = require('schema');
var DATABASE_NAME = 'InDiaryMain'

exports.createDatabase = function(){
	var db = Ti.Database.open(DATABASE_NAME);
    ['entries', 'cases'].forEach(function(tableName) {
        var fieldNameAndTypes = [];
        schema.fields[tableName].forEach(function(field){
            var fieldType = (field.type == 'id') ? 'INTEGER' : 'TEXT';
            fieldNameAndTypes.push(field.name + ' ' + fieldType);
        });
        db.execute('CREATE TABLE IF NOT EXISTS ' + tableName + 
                   '(id INTEGER PRIMARY KEY, ' + 
                   fieldNameAndTypes.join(', ') + ')');
    });
    ['entries', 'cases'].forEach(function(tableName) {
        schema.fields[tableName].forEach(function(field){
            if (field.type == 'id'){
                var numRows = db.execute('SELECT COUNT(*) FROM ' + 
                                         field.tableName).field(0);
                if (numRows > 0)
                    return;
                exports.addRow(field.tableName,
                               schema.metadata[field.tableName].defaultData);
            }
        });
    });
	db.close();
};

exports.deleteDatabase = function(){
	var db = Ti.Database.open(DATABASE_NAME);
	db.close();
	db.remove();
};

exports.addRow = function(tableName, rowData) {
    var fieldNames = [];
    var fieldValues = [];
    schema.fields[tableName].forEach(function(field) {
        if (field.type == 'list')
            return;
        fieldNames.push(field.name);
        var value = rowData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        if (field.type != 'id'){
            value = util.quotify(value.replace(/'/g,"''"));
        }       
        fieldValues.push(value);
    });
	var db = Ti.Database.open(DATABASE_NAME);
	db.execute('INSERT INTO ' + tableName + ' (' +
               fieldNames.join(', ') + ') VALUES (' + 
               fieldValues.join(', ') + ')');
	db.close();
};

exports.editRow = function(tableName, rowData) {
    var fieldNamesAndValues = [];
    schema.fields[tableName].forEach(function(field) {
        if (field.type == 'list')
            return;
        var value = rowData[field.name];
        if (field.type == 'datetime'){
            value = value.toISOString();
        }
        if (field.type != 'id'){
            value = util.quotify(value.replace(/'/g,"''"));
        }
        fieldNamesAndValues.push(field.name + '=' + value);
    });
    var db = Ti.Database.open(DATABASE_NAME);
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
            id : id
        };
        schema.fields[tableName].forEach(function(field) {
            if (field.type == 'list')
                return;
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
    var selectRowsQueryText = function(tableName, searchCriteria, columnName){
        columnName = (typeof(columnName) === 'undefined') ?
            '*' : columnName;
        var orderBy = (typeof(searchCriteria.orderBy) === 'undefined') ? 
            'id' : searchCriteria.orderBy;
        var ascending = (typeof(searchCriteria.ascending) === 'undefined') ? 
            false : searchCriteria.ascending;
        var ascText = (ascending) ? 'ASC' : 'DESC';
        
        var escapeChar = '~';
        var matchRe = new RegExp('[%_' + escapeChar + ']','g');
        
        var matchFieldsAndValues = [];
        var rangeFieldsAndValues = [];
        var inFieldsAndValues = [];
        
        schema.fields[tableName].forEach(function(field) {
            if (field.type == 'list')
                return;
            var value = searchCriteria[field.name];
            if (value === '')
                delete searchCriteria[field.name];
            if (typeof(value) === "string") {
                value = util.quotify(value.replace(matchRe, escapeChar + '$&'),
                                     '%');
                value = util.quotify(value.replace(/'/g, "''"));
                matchFieldsAndValues.push(field.name + ' LIKE ' + value +
                                          ' ESCAPE ' +
                                          util.quotify(escapeChar));
            } else if (typeof(value) == "number") {
                matchFieldsAndValues.push(field.name + ' == ' + value);
            }
            var range = searchCriteria[field.name + 'Range'];
            if (range instanceof Array) {
                if (field.type == 'datetime') {
                    range = [range[0].toISOString(), range[1].toISOString()]
                }
                rangeFieldsAndValues.push(field.name + ' BETWEEN ' +
                                          util.quotify(range[0]) + ' AND ' + 
                                          util.quotify(range[1]));
            }
            var subCriteria = searchCriteria[field.name + 'Criteria'];
            if (typeof(subCriteria) === "object") {
                var emptyCriteria = true;
                for (criterion in subCriteria) {
                    if (subCriteria[criterion] !== ''){
                        emptyCriteria = false;
                        break;
                    }
                }
                if (!emptyCriteria){
                    var subQueryText = selectRowsQueryText(field.tableName,
                                                           subCriteria, 'id');
                    inFieldsAndValues.push(field.name + ' IN ' + '(' +
                                           subQueryText + ')');
                }
            }
        });
        var matchText = matchFieldsAndValues.join(' AND ');
        var rangeText = rangeFieldsAndValues.join(' AND ');
        var inText = inFieldsAndValues.join(' AND ');
        var whereComponents = [matchText, rangeText, inText].
            filter(function(element){return (element.length > 0)});
        var whereText = (whereComponents.length === 0) ?
            '' : 'WHERE ' + whereComponents.join(' AND ') + ' ';

        var queryText = 'SELECT ' + columnName + ' FROM ' + tableName + ' ' +
                        whereText + 'ORDER BY ' + orderBy + ' ' + ascText;
        
        return queryText;
    };

	var rowsData = [];
	var db = Ti.Database.open(DATABASE_NAME);
	var rows = db.execute(selectRowsQueryText(tableName, searchCriteria));
	db.close();
	while (rows.isValidRow()) {
		var	rowData = {
            id : rows.fieldByName('id')
		};
        schema.fields[tableName].forEach(function(field) {
            if (field.type == 'list')
                return;
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
