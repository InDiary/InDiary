var util = require('util');

exports.entryFields = [];

var textField = {
    name : 'text',
    type : 'string',
    displayName : L('entryText'),
    hintText : L('entryTextDefault'),
};
exports.entryFields.push(textField);

var datetimeField = {
    name : 'datetime',
    type : 'datetime',
    displayName : L('datetime'),
    hintText : L('datetimeDefault'),
};
exports.entryFields.push(datetimeField);

var locationField = {
    name : 'location',
    type : 'location',
    displayName : L('location'),
    hintText : L('locationDefault'),
};
exports.entryFields.push(locationField);

var caseIdField = {
    name : 'caseId',
    type : 'string',
    displayName : L('caseId'),
    hintText : L('caseIdDefault'),
};
exports.entryFields.push(caseIdField);

exports.maxRecentFieldEntries = 5;
