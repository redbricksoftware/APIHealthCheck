"use strict";
var es6_promise_1 = require('es6-promise');
//import {Moment} from 'moment';
var mysql = require('mysql');
var moment = require('moment');
var acctDetails = require('./acctDetails.json');
var pool = mysql.createPool({
    connectionLimit: acctDetails.connectionLimit,
    host: acctDetails.host,
    user: acctDetails.user,
    password: acctDetails.password,
    database: acctDetails.database
});
var APIConfig_1 = require('./models/APIConfig');
var daHealthCheck = (function () {
    function daHealthCheck() {
        this.init();
    }
    daHealthCheck.prototype.init = function () {
        var createUsers = function () {
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
        var createTenants = function () {
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
        var createAPIConfigs = function () {
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
        var insertAPIStatus = function () {
            pool.query('INSERT INTO APIStatusDetails set ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:15', DTAPingResponseMS: 425, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIStatusDetails set ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:30', DTAPingResponseMS: 550, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIStatusDetails set ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:45', DTAPingResponseMS: 375, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIStatusDetails set ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:01:00', DTAPingResponseMS: 375, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
                queryAll('APIStatusDetails');
            });
        };
        //insertAPIStatus();
        var queryAll = function (table) {
            pool.query('SELECT * FROM ' + table, function (error, results, fields) {
                console.log(results);
                closePool();
            });
        };
        var closePool = function () {
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
        var configs2 = this.getAPIConfigByName(1, 'a')
            .then(function (resp) {
            console.log('got resp:');
            console.log(resp);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    daHealthCheck.prototype.getHealthCheck = function () {
    };
    daHealthCheck.prototype.addAPIConfig = function (config) {
    };
    daHealthCheck.prototype.updateAPIConfig = function (config) {
    };
    daHealthCheck.prototype.getAPIConfigAll = function () {
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query('SELECT * FROM APIConfigs', function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnAPIConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    };
    daHealthCheck.prototype.getAPIConfigByTenantID = function (tenantID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query('SELECT * FROM APIConfigs WHERE CFGTenantID = ?', tenantID, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnAPIConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    };
    daHealthCheck.prototype.getAPIConfigByName = function (tenantID, name) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query('SELECT * FROM APIConfigs WHERE CFGTenantID = ? AND CFGName LIKE ?', [tenantID, 'API%' + name + '%'], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnAPIConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    };
    daHealthCheck.prototype.getAPIConfigByID = function (tenantID, apiConfigID) {
    };
    daHealthCheck.prototype.getAPIDataByTenantID = function (tenantID) {
    };
    daHealthCheck.prototype.getAPIDataByAPIID = function (tenantID, apiConfigID) {
    };
    daHealthCheck.prototype.addAPIData = function (tenantID, apiConfigID, status, responseTimeMS) {
    };
    return daHealthCheck;
}());
var health = new daHealthCheck();
