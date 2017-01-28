"use strict";

let dynamo = require('./dynamodb');

function getbyID() {
    dynamo.getAPIDataByAPIID('tenanta', '1a')
        .then(function (response) {
            console.log(response);
        })
        .catch(function (err) {
            console.error(err);
        });
}

function getAll() {
    dynamo.getAPIConfigAll()
        .then(function (response) {
            console.log(response);
        }).catch(function (err) {
        console.error(err);
    });
}

function getbytenant() {
    dynamo.getAPIDataByTenantID('tenanta')
        .then(function (response) {
            console.log(response);
        }).catch(function (err) {
        console.error(err);
    });
}

getAll();
getbyID();
//getbytenant();

//seedData();
function seedData() {
    dynamo.addOrUpdateAPIConfig('Tenanta', '1a', 'some new API 1a', 'https://someAPI.com/', true, 200, 500, '');
    dynamo.addOrUpdateAPIConfig('Tenanta', '1b', 'some new API 1b', 'https://someAPI.com/', true, 200, 500, '');
    dynamo.addOrUpdateAPIConfig('Tenanta', '1c', 'some new API 1c', 'https://someAPI.com/', true, 200, 500, '');
    dynamo.addOrUpdateAPIConfig('Tenantb', '2a', 'some new API 2a', 'https://someAPI.com/', true, 200, 500, '');
    dynamo.addOrUpdateAPIConfig('Tenantb', '2b', 'some new API 2b', 'https://someAPI.com/', true, 200, 500, '');
    dynamo.addOrUpdateAPIConfig('Tenantb', '2c', 'some new API 2c', 'https://someAPI.com/', true, 200, 500, '');
}