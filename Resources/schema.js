exports.fields = {};

exports.fields['entries'] = [];

var entryTextField = {
    name : 'text',
    type : 'string',
    displayName : L('entryText'),
    hintText : L('entryTextDefault')
};
exports.fields['entries'].push(entryTextField);

var entryDatetimeField = {
    name : 'datetime',
    type : 'datetime',
    displayName : L('datetime'),
    hintText : L('datetimeDefault')
};
exports.fields['entries'].push(entryDatetimeField);

var entryLocationField = {
    name : 'location',
    type : 'location',
    displayName : L('location'),
    hintText : L('locationDefault')
};
exports.fields['entries'].push(entryLocationField);

var entryCaseIdField = {
    name : 'caseId',
    type : 'id',
    tableName: 'cases',
    displayName : L('caseId'),
    hintText : L('caseIdDefault')
};
exports.fields['entries'].push(entryCaseIdField);

exports.fields['cases'] = [];

var caseNameField = {
    name : 'name',
    type : 'string',
    displayName : L('caseName'),
    hintText : L('caseNameDefault')
};
exports.fields['cases'].push(caseNameField);

var caseDatetimeField = {
    name : 'datetime',
    type : 'datetime',
    displayName : L('caseDatetime'),
    hintText : L('caseDatetimeDefault')
};
exports.fields['cases'].push(caseDatetimeField);

exports.maxRecentFieldEntries = 5;
