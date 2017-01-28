import {Tenant} from "./models/Tenant";
import {Promise} from 'es6-promise';
//import {Moment} from 'moment';
const mysql = require('mysql');
const moment = require('moment');

const acctDetails = require('./acctDetails.json');

const pool = mysql.createPool({
    connectionLimit: acctDetails.connectionLimit,
    host: acctDetails.host,
    user: acctDetails.user,
    password: acctDetails.password,
    database: acctDetails.database
});

import {APIConfig} from './models/APIConfig';
import {APIStatusDetail} from './models/APIStatusDetail';
import {User} from './models/User';

class daHealthCheck {

    constructor() {
        this.init();
    }

    init() {

        let createUsers = function () {
            pool.query('INSERT INTO Users set USRIdentityUserID=?', 'identity1', function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO Users set USRIdentityUserID=?', 'identity2', function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
        };
        //createUsers();


        let createTenants = function () {
            pool.query('INSERT INTO Tenants set ?', {
                TNTName: 'Tenant1',
                TNTCode: 'TNT1',
                TNTPrimaryUserID: 1
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO Tenants set ?', {
                TNTName: 'Tenant2',
                TNTCode: 'TNT2',
                TNTPrimaryUserID: 2
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
        };
        //createTenants();


        let createAPIConfigs = function () {
            pool.query('INSERT INTO APIConfigs set ?', {
                CFGName: 'API1a', CFGTenantID: 1, CFGURI: 'http://google.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 60, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO APIConfigs set ?', {
                CFGName: 'API1b', CFGTenantID: 1, CFGURI: 'http://google2.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 120, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO APIConfigs set ?', {
                CFGName: 'API1c', CFGTenantID: 1, CFGURI: 'http://google3.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 240, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO APIConfigs set ?', {
                CFGName: 'API2a', CFGTenantID: 2, CFGURI: 'http://yahoo.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 60, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO APIConfigs set ?', {
                CFGName: 'API2b', CFGTenantID: 2, CFGURI: 'http://yahoo2.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 120, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });

            pool.query('INSERT INTO APIConfigs set ?', {
                CFGName: 'API2c', CFGTenantID: 2, CFGURI: 'http://yahoo.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 240, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
        };
        //createAPIConfigs();


        let insertAPIStatus = function () {
            pool.query('INSERT INTO APIStatusDetails set ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:15', DTAPingResponseMS: 425, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

            pool.query('INSERT INTO APIStatusDetails set ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:30', DTAPingResponseMS: 550, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

            pool.query('INSERT INTO APIStatusDetails set ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:45', DTAPingResponseMS: 375, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

            pool.query('INSERT INTO APIStatusDetails set ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:01:00', DTAPingResponseMS: 375, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                    queryAll('APIStatusDetails');
                });

        };
        //insertAPIStatus();


        let queryAll = function (table) {
            pool.query('SELECT * FROM ' + table, function (error, results, fields) {
                console.log(results);
                closePool();
            });

        };


        let closePool = function () {
            pool.end(function (err) {
                // all connections in the pool have ended
            });
        };

        /*
         let configs = this.getAPIConfigByTenantID(1)
         .then(function (resp) {
         console.log('got resp:');
         console.log(resp);
         })
         .catch(function (err) {
         console.log(err);
         });
         */

        let configs2 = this.getAPIConfigByName(1, 'a')
            .then(function (resp) {
                console.log('got resp:');
                console.log(resp);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    getHealthCheck() {


    }

    addAPIConfig(config: APIConfig) {

    }

    updateAPIConfig(config: APIConfig) {

    }

    getAPIConfigAll() {
        return new Promise(function (resolve, reject) {
            pool.query('SELECT * FROM APIConfigs', function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    let returnAPIConfigs = [];
                    for (let i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    }

    getAPIConfigByTenantID(tenantID): Promise<APIConfig[]> {

        return new Promise(function (resolve, reject) {
            pool.query('SELECT * FROM APIConfigs WHERE CFGTenantID = ?', tenantID, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    let returnAPIConfigs = [];
                    for (let i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    }


    getAPIConfigByName(tenantID, name) {

        return new Promise(function (resolve, reject) {
            pool.query('SELECT * FROM APIConfigs WHERE CFGTenantID = ? AND CFGName LIKE ?', [tenantID, 'API%' + name + '%'], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    let returnAPIConfigs = [];
                    for (let i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    }


    getAPIConfigByID(tenantID, apiConfigID) {

    }

    getAPIDataByTenantID(tenantID) {

    }

    getAPIDataByAPIID(tenantID, apiConfigID) {

    }

    addAPIData(tenantID, apiConfigID, status, responseTimeMS) {

    }
}

let health = new daHealthCheck();
