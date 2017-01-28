'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const moment = require('moment');

AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

//initAPIDBs(true); //false is optional. true would drop and re-create tables.

function initAPIDBs(reset) {

    if (!reset) {
        reset = false;
    }

    let apiConfigTableSchema = {
        TableName: 'APIConfig',
        KeySchema: [
            {AttributeName: 'apiConfigID', KeyType: 'HASH'},
            {AttributeName: 'tenantID', KeyType: 'RANGE'}
        ],
        AttributeDefinitions: [
            {AttributeName: 'apiConfigID', AttributeType: 'S'},
            {AttributeName: 'tenantID', AttributeType: 'S'}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2
        }
    };

    let apiDataTableSchema = {
        TableName: 'APIData',
        KeySchema: [
            {AttributeName: 'apiDataID', KeyType: 'HASH'},
            {AttributeName: 'apiConfigID', KeyType: 'RANGE'}
        ],
        AttributeDefinitions: [
            {AttributeName: 'apiDataID', AttributeType: 'S'},
            {AttributeName: 'apiConfigID', AttributeType: 'S'},
            {AttributeName: 'tenantID', AttributeType: 'S'}
        ],
        GlobalSecondaryIndexes: [
            {
                IndexName: 'idx_tenantID',
                KeySchema: [
                    {AttributeName: 'tenantID', KeyType: 'HASH'}
                    //,{AttributeName: 'apiConfigID', KeyType: 'RANGE'}
                ],
                Projection: {
                    ProjectionType: 'ALL'
                },
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10
                }
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    createTable(apiConfigTableSchema);
    createTable(apiDataTableSchema);

    function createTable(schema) {
        dynamodb.describeTable({'TableName': schema.TableName}, function (err, data) {
            if (err) {
                if (err.code == 'ResourceNotFoundException') {
                    //Table does not exists

                    dynamodb.createTable(schema, function (err, data) {
                        if (err) {
                            console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
                        } else {
                            console.log('Created table. Table name: ' + data.TableDescription.TableName);
                            //console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
                        }
                    });
                } else {
                    //Unknown error!!!
                    console.error(err);
                }
            } else {
                //Table exists
                if (reset) {
                    dynamodb.deleteTable({'TableName': schema.TableName}, function (err, data) {
                        createTable(schema);
                    });
                }
            }
        });
    }
}

function addToTable(params) {
    return new Promise(function (resolve, reject) {

        docClient.put(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log('Added item:', JSON.stringify(data, null, 2));
            }
        });
    });
}

//addOrUpdateAPIConfig('Tenantb', '', 'some new API 3b', 'https://someAPI.com/', true, 200, 500, '');
//getAPIConfigByName('tenantA', 'some new API');
//getAPIConfigByID('TenantA', 'fafd9a94-86d1-4971-8ba4-bb8f9cb82092');
//getAPIConfigByTenantID('Tenanta');

//TODO: bubble up the validation to the APIs
exports.addOrUpdateAPIConfig = function (tenantID, apiConfigID, name, uri, enabled, pollFrequencyInSeconds, maxResponseTimeMS, emergencyContactGroup, callback) {

    return new Promise(function (resolve, reject) {

        if ((tenantID && tenantID.toString().trim() != '')
            && (name && name.toString().trim() != '')
            && (uri && uri.toString().trim() != '' && validateURL(uri))
        ) {

            let params = {
                TableName: 'APIConfig',
                Item: {
                    //TOOD: if ID exists then this performs update so implement updating!
                    'apiConfigID': apiConfigID == undefined || apiConfigID == null || apiConfigID == '' ? uuid() : apiConfigID,
                    'tenantID': normalizeTenantID(tenantID),
                    'name': name == undefined || null ? uri : name,
                    'uri': uri,
                    'enabled': enabled == undefined || null ? true : enabled,
                    'pollFrequencyInSeconds': pollFrequencyInSeconds == undefined || null ? 600 : pollFrequencyInSeconds,
                    'maxResponseTimeMS': maxResponseTimeMS == undefined || null ? 2500 : maxResponseTimeMS
                    //,'emergencyContactGroup': emergencyContactGroup == undefined || null ? '' : emergencyContactGroup
                }
            };

            addToTable(params)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        } else {
            let errs = [];
            //TODO: return error
            if (!tenantID || tenantID.trim() == '') {
                errs.push({'error': 'Tenant ID is required'});
                //console.error('Tenant ID is required');
            }
            if (!name || name.trim() == '') {
                errs.push({'error': 'Name is required'});
                //console.error('Name is required');
            }
            if (!uri || uri.trim() == '') {
                errs.push({'error': 'URI is required'});
                //console.error('URI is required');
            }
            if (!validateURL(uri)) {
                errs.push({'error': 'URI must be valid'});
                //console.error('URI must be valid');
            }

            reject(errs);
        }
    });
};

exports.getAPIConfigAll = function () {

    let params = {
        TableName: 'APIConfig'
        /*,
         FilterExpression: 'contains(#name, :nameVal) AND #tenantID = :tenantID', //= equal, <> not equal, >=, > etc.
         ExpressionAttributeNames: {
         '#name': 'name',
         '#tenantID': 'tenantID'
         },
         ExpressionAttributeValues: {
         ':nameVal': name,
         ':tenantID': normalizeTenantID(tenantID)
         }
         */
    };

    return new Promise(function (resolve, reject) {

        docClient.scan(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log("Query succeeded.");
                //data.Items.forEach(function (item) {
                //    console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //});
            }
        });
    });
};

exports.getAPIConfigByName = function (tenantID, name) {

    let params = {
        TableName: 'APIConfig',
        FilterExpression: 'contains(#name, :nameVal) AND #tenantID = :tenantID', //= equal, <> not equal, >=, > etc.
        ExpressionAttributeNames: {
            '#name': 'name',
            '#tenantID': 'tenantID'
        },
        ExpressionAttributeValues: {
            ':nameVal': name,
            ':tenantID': normalizeTenantID(tenantID)
        }
    };

    return new Promise(function (resolve, reject) {

        docClient.scan(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log("Query succeeded.");
                //data.Items.forEach(function (item) {
                //    console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //});
            }
        });
    });
};

exports.getAPIConfigByTenantID = function (tenantID) {

    console.log(tenantID);
    let params = {
        TableName: 'APIConfig',
        FilterExpression: '#tenantID = :tenantID', //= equal, <> not equal, >=, > etc.
        ExpressionAttributeNames: {
            '#tenantID': 'tenantID'
        },
        ExpressionAttributeValues: {
            ':tenantID': normalizeTenantID(tenantID)
        }
    };

    return new Promise(function (resolve, reject) {

        docClient.scan(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log("Query succeeded.");
                //data.Items.forEach(function (item) {
                //    console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //});
            }
        });
    });
};

exports.getAPIConfigByID = function (tenantID, apiConfigID) {

    let params = {
        TableName: 'APIConfig',
        KeyConditionExpression: 'apiConfigID = :apiConfigID AND tenantID = :tenantID',
        ExpressionAttributeValues: {
            ':apiConfigID': normalizeUUID(apiConfigID),
            ':tenantID': normalizeTenantID(tenantID)
        }
    };
    return new Promise(function (resolve, reject) {

        docClient.query(params, function (err, data) {
            if (err) {
                reject(err);
                //console.log('Unable to query. Error:', JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log('Query succeeded.');
                //data.Items.forEach(function (item) {
                //    console.log(item);
                //});
            }
        });
    });
};

exports.getAPIDataByTenantID = function (tenantID) {

    console.log(tenantID);

    let params = {
        TableName: 'APIData',
        KeyConditionExpression: '#tenantID = :tenantID',
        ExpressionAttributeNames: {
            '#tenantID': 'tenantID'
        },
        ExpressionAttributeValues: {
            ':tenantID': normalizeTenantID(tenantID)
        }
    };

    return new Promise(function (resolve, reject) {

        docClient.query(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log("Query succeeded.");
                //data.Items.forEach(function (item) {
                //    console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //});
            }
        });
    });
};

exports.getAPIDataByAPIID = function (tenantID, apiConfigID) {

    console.log('tenantid: ' + normalizeTenantID(tenantID) + ' configid: ' + apiConfigID);


    let params = {
        TableName: 'APIData',
        FilterExpression: 'tenantID = :tenantID',// AND #apiConfigID = :apiConfigID', //= equal, <> not equal, >=, > etc.
        IndexName: 'idx_tenantID',
        ExpressionAttributeValues: {
            ':tenantID': normalizeTenantID(tenantID),
        }
    };

    return new Promise(function (resolve, reject) {

        docClient.scan(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log("Query succeeded.");
                //data.Items.forEach(function (item) {
                //    console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //});
            }
        });
    });


    params = {
        TableName: 'APIData',
        FilterExpression: '#tenantID = :tenantID AND #apiConfigID = :apiConfigID', //= equal, <> not equal, >=, > etc.
        ExpressionAttributeNames: {
            '#tenantID': 'tenantID',
            '#apiConfigID': 'apiConfigID'
        },
        ExpressionAttributeValues: {
            ':tenantID': normalizeTenantID(tenantID),
            ':apiConfigID': normalizeUUID(apiConfigID)
        }
    };

    return new Promise(function (resolve, reject) {

        docClient.scan(params, function (err, data) {
            if (err) {
                reject(err);
                //console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                resolve(data);
                //console.log("Query succeeded.");
                //data.Items.forEach(function (item) {
                //    console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //});
            }
        });
    });
};

exports.addAPIData = function (tenantID, apiConfigID, status, responseTimeMS) {
    //TODO verify tenantID exists and API ConfigID exists
    //TODO check status against enum

    if (responseTimeMS == null || responseTimeMS == undefined || responseTimeMS.toString().trim() == '') {
        responseTimeMS = -1;
    }

    return new Promise(function (resolve, reject) {

        if ((tenantID && tenantID.toString().trim() != '')
            && (apiConfigID && apiConfigID.toString().trim() != '')
            && (!isNaN(responseTimeMS))
        ) {

            let params = {
                TableName: 'APIData',
                Item: {
                    'apiDataID': uuid(),
                    'tenantID': normalizeTenantID(tenantID),
                    'apiConfigID': normalizeUUID(apiConfigID),
                    'statusTime': moment(),
                    'status': status == null || status == undefined || status.toString().trim() == '' ? 'unknown' : status,
                    'responseTimeMS': responseTimeMS
                }
            };

            addToTable(params)
                .then(function (data) {
                    console.log(data);
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        } else {
            let errs = [];
            //TODO: return error
            if (!tenantID || tenantID.trim() == '') {
                errs.push({'error': 'Tenant ID is required'});
                //console.error('Tenant ID is required');
            }
            if (!apiConfigID || apiConfigID.trim() == '') {
                errs.push({'error': 'Name is required'});
                //console.error('Name is required');
            }
            if (isNaN(responseTimeMS)) {
                errs.push({'error': 'Invalid Response Time'});
                //console.error('URI is required');
            }

            reject(errs);
        }
    });
};


function normalizeTenantID(tenantID) {
    return tenantID.toString().trim().toLowerCase();
}

function normalizeUUID(uuid) {
    return uuid.toString().trim().toLowerCase();
}

function validateURL(url) {
    let re_weburl = new RegExp(
        "^" +
        // protocol identifier
        "(?:(?:https?|ftp)://)" +
        // user:pass authentication
        "(?:\\S+(?::\\S*)?@)?" +
        "(?:" +
        // IP address exclusion
        // private & local networks
        "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
        "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
        "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
        // IP address dotted notation octets
        // excludes loopback network 0.0.0.0
        // excludes reserved space >= 224.0.0.0
        // excludes network & broacast addresses
        // (first & last IP address of each class)
        "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
        "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
        "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
        "|" +
        // host name
        "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
        // domain name
        "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
        // TLD identifier
        "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
        // TLD may end with dot
        "\\.?" +
        ")" +
        // port number
        "(?::\\d{2,5})?" +
        // resource path
        "(?:[/?#]\\S*)?" +
        "$", "i"
    );

    if (url && url.toString().match(re_weburl)) {
        return url.toString().match(re_weburl).index == 0 ? true : false;
    } else {
        return false;
    }

}

return module.exports;