'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');

AWS.config.update({
    region: 'us-west-2',
    endpoint: 'http://localhost:8000'
});

const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

initAPIConfigDB(false); //false is optional

function initAPIConfigDB(reset) {

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
            {AttributeName: 'tenantID', KeyType: 'RANGE'}
        ],
        AttributeDefinitions: [
            {AttributeName: 'apiDataID', AttributeType: 'S'},
            {AttributeName: 'tenantID', KeyType: 'S'}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    };

    createTable(apiConfigTableSchema);
    createTable(apiDataTableSchema);

    function createTable(schema) {
        dynamodb.describeTable({'TableName': apiConfigTableSchema.TableName}, function (err, data) {
            if (err) {
                if (err.code == 'ResourceNotFoundException') {
                    //Table does not exists

                    dynamodb.createTable(schema, function (err, data) {
                        if (err) {
                            console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2));
                        } else {
                            console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2));
                        }
                    });
                } else {
                    //Unknown error!!!
                    console.error(err);
                }
            } else {
                //Table exists
                if (reset) {
                    dynamodb.deleteTable({'TableName': apiConfigTableSchema.TableName}, function (err, data) {
                        createTable(schema);
                    });
                }
            }
        });
    }
}

function addToTable(params) {
    docClient.put(params, function (err, data) {
        if (err) {
            console.error('Unable to add item. Error JSON:', JSON.stringify(err, null, 2));
        } else {
            console.log('Added item:', JSON.stringify(data, null, 2));
        }
    });
}

//addAPIConfig('TenantA', 'some new API', 'https://someAPI', true, 200, 500, '');
getAPIConfigByName('tenantA', 'some new API');
getAPIConfigByID('TenantA', 'fafd9a94-86d1-4971-8ba4-bb8f9cb82092');

//TODO: bubble up the validation to the APIs
function addAPIConfig(tenantID, name, uri, enabled, pollFrequencyInSeconds, maxResponseTimeMS, emergencyContactGroup, callback) {

    if ((tenantID && tenantID.toString().trim() != '')
        && (name && name.toString().trim() != '')
        && (uri && uri.toString().trim() != '' && validateURL(uri))
    ) {

        let params = {
            TableName: 'APIConfig',
            Item: {
                //TOOD: if ID exists then this performs update so implement updating!
                'apiConfigID': normalizeUUID(uuid()),
                'tenantID': normalizeTenantID(tenantID),
                'name': name == undefined || null ? uri : name,
                'uri': uri,
                'enabled': enabled == undefined || null ? true : enabled,
                'pollFrequencyInSeconds': pollFrequencyInSeconds == undefined || null ? 600 : pollFrequencyInSeconds,
                'maxResponseTimeMS': maxResponseTimeMS == undefined || null ? 2500 : maxResponseTimeMS
                //,'emergencyContactGroup': emergencyContactGroup == undefined || null ? '' : emergencyContactGroup
            }
        };

        console.log('Adding a new item: ' + name + ' - ' + uri + ' - ' + enabled);
        addToTable(params);
    } else {
        //TODO: return error
        if (!tenantID || tenantID.trim() == '') {
            console.error('Tenant ID is required');
        }
        if (!name || name.trim() == '') {
            console.error('Name is required');
        }
        if (!uri || uri.trim() == '') {
            console.error('URI is required');
        }
        if (!validateURL(uri)) {
            console.error('URI must be valid.');
        }
    }

}

function getAPIConfigByName(tenantID, name) {

    let params = {
        TableName: 'APIConfig',
        FilterExpression: 'contains(#name, :nameVal) AND #tenantID = :tenantID', //= equal, <> not equal, >=, > etc.
        ExpressionAttributeNames: {
            '#name': 'name',
            '#tenantID': 'tenantID'
        },
        ExpressionAttributeValues: {
            ':nameVal': name,
            ':tenantID': 'tenantA'//normalizeTenantID(tenantID)
        }
    };

    docClient.scan(params, function (err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            data.Items.forEach(function (item) {
                console.log(" -", item.apiConfigID + ": " + item.name + ' for ' + normalizeTenantID(item.tenantID));
                //console.log(item);
            });
        }
    });
}

function getAPIConfigByID(tenantID, apiConfigID) {

    let params = {
        TableName: 'APIConfig',
        KeyConditionExpression: 'apiConfigID = :apiConfigID AND tenantID = :tenantID',
        ExpressionAttributeValues: {
            ':apiConfigID': normalizeUUID(apiConfigID),
            ':tenantID': normalizeTenantID(tenantID)
        }
    };

    docClient.query(params, function (err, data) {
        if (err) {
            console.log('Unable to query. Error:', JSON.stringify(err, null, 2));
        } else {
            console.log('Query succeeded.');
            data.Items.forEach(function (item) {
                console.log(item);
            });
        }
    });


}

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

    if (url.toString().match(re_weburl)) {
        return url.toString().match(re_weburl).index == 0 ? true : false;
    } else {
        return false;
    }

}
