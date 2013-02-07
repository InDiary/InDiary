var util = require('util');

exports.fields = [];

var datetimeField = {
    name : 'datetime',
    type : 'datetime',
    displayName : L('datetime'),
    hintText : L('datetimeDefault'),
};
exports.fields.push(datetimeField);

var locationField = {
    name : 'location',
    type : 'location',
    displayName : L('location'),
    hintText : L('locationDefault'),
};
exports.fields.push(locationField);

var caseIdField = {
    name : 'caseId',
    type : 'string',
    displayName : L('caseId'),
    hintText : L('caseIdDefault'),
};
exports.fields.push(caseIdField);

exports.makeRecentPropName = function(name){
    return 'recent' + util.capitalise(name) + 'List';
};

exports.maxRecentFieldEntries = 5;
