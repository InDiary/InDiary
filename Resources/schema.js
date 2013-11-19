exports.fields = {};

exports.fields['entries'] = [];

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

var entryTextField = {
    name : 'text',
    type : 'areaString',
    displayName : L('entryText'),
    hintText : L('entryTextDefault'),
    showInToolbar : true
};
exports.fields['entries'].push(entryTextField);

exports.fields['cases'] = [];

var caseNameField = {
    name : 'name',
    type : 'string',
    displayName : L('caseName'),
    hintText : L('caseNameDefault'),
    showInToolbar : true
};
exports.fields['cases'].push(caseNameField);

var caseDatetimeField = {
    name : 'datetime',
    type : 'datetime',
    displayName : L('caseDatetime'),
    hintText : L('caseDatetimeDefault')
};
exports.fields['cases'].push(caseDatetimeField);

var caseSummaryField = {
    name : 'summary',
    type : 'areaString',
    displayName : L('caseSummary'),
    hintText : L('caseSummaryDefault')
};
exports.fields['cases'].push(caseSummaryField);

var caseEntriesField = {
    name : 'entries',
    type : 'list',
    tableName : 'entries',
    idField : 'caseId',
    orderBy : 'datetime',
    displayName : L('caseEntries')
};
exports.fields['cases'].push(caseEntriesField);

exports.maxRecentFieldEntries = 5;
