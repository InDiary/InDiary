var util = require('util');

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
    hintText : L('caseIdDefault'),
};
exports.fields['entries'].push(entryCaseIdField);

var entryTextField = {
    name : 'text',
    type : 'areaString',
    displayName : L('entryText'),
    hintText : L('entryTextDefault'),
    showInToolbar : true,
    toolbarHintText : L('newEntry'),
    searchHintText : L('searchEntries')
};
exports.fields['entries'].push(entryTextField);

exports.fields['cases'] = [];

var caseNameField = {
    name : 'name',
    type : 'string',
    displayName : L('caseName'),
    hintText : L('caseNameDefault'),
    showInToolbar : true,
    toolbarHintText : L('newCase')
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

exports.metadata = {}

exports.metadata['entries'] = {
    rowPrimaryText : function(data){
        return data.text;
    },
    rowSecondaryText : function(data){
        return util.datetimeFormat(data.datetime) +
                                       ', ' + data.location
    }
}

exports.metadata['cases'] = {
    rowPrimaryText : function(data){
        return data.name;
    },
    rowSecondaryText : function(data){
        return data.summary;
    },
    defaultData : {
        name : L('misc'),
        datetime : new Date(),
        summary : L('miscSummary')
    }
}

exports.maxRecentFieldEntries = 5;
