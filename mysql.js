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
var APIStatusDetail_1 = require('./models/APIStatusDetail');
var APIStatusEnum_1 = require('./models/APIStatusEnum');
var util_1 = require("util");
var daHealthCheck = (function () {
    function daHealthCheck() {
        this.init();
    }
    daHealthCheck.prototype.init = function () {
        var createUsers = function () {
            pool.query('INSERT INTO Users SET USRIdentityUserID=?', 'identity1', function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO Users SET USRIdentityUserID=?', 'identity2', function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
        };
        //createUsers();
        var createTenants = function () {
            pool.query('INSERT INTO Tenants SET ?', {
                TNTName: 'Tenant1',
                TNTCode: 'TNT1',
                TNTPrimaryUserID: 1
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO Tenants SET ?', {
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
            pool.query('INSERT INTO APIConfigs SET ?', {
                CFGName: 'API1a', CFGTenantID: 1, CFGURI: 'http://google.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 60, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIConfigs SET ?', {
                CFGName: 'API1b', CFGTenantID: 1, CFGURI: 'http://google2.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 120, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIConfigs SET ?', {
                CFGName: 'API1c', CFGTenantID: 1, CFGURI: 'http://google3.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 240, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIConfigs SET ?', {
                CFGName: 'API2a', CFGTenantID: 2, CFGURI: 'http://yahoo.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 60, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIConfigs SET ?', {
                CFGName: 'API2b', CFGTenantID: 2, CFGURI: 'http://yahoo2.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 120, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIConfigs SET ?', {
                CFGName: 'API2c', CFGTenantID: 2, CFGURI: 'http://yahoo.com',
                CFGEnabled: true, CFGPollFrequencyInSeconds: 240, CFGMaxResponseTimeMS: 2000
            }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
        };
        //createAPIConfigs();
        var insertAPIStatus = function () {
            pool.query('INSERT INTO APIStatusDetails SET ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:15', DTAPingResponseMS: 425, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIStatusDetails SET ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:30', DTAPingResponseMS: 550, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIStatusDetails SET ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:45', DTAPingResponseMS: 375, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
            pool.query('INSERT INTO APIStatusDetails SET ?', { DTAConfigID: 1, DTADateTime: '2016-12-31 00:01:00', DTAPingResponseMS: 375, DTAStatus: 1 }, function (error, results, fields) {
                console.log(error);
                console.log(results);
            });
        };
        //insertAPIStatus();
        var me = this;
        var insertAFewSampleStatus = function () {
            var now = new Date();
            now = addMinutes(now, 120);
            for (var i = 0; i < 10; i++) {
                var randNum = Math.random();
                var pingResponse = Math.floor(randNum * 1200) + 350;
                var apiStatus = APIStatusEnum_1.APIStatus.Up;
                if (randNum >= .8 && randNum < .92) {
                    apiStatus = APIStatusEnum_1.APIStatus.Degraded;
                }
                else if (randNum >= .92 && randNum < .96) {
                    apiStatus = APIStatusEnum_1.APIStatus.Down;
                }
                else if (randNum >= .96) {
                    apiStatus = APIStatusEnum_1.APIStatus.Unknown;
                }
                var statusDetail = new APIStatusDetail_1.APIStatusDetail();
                statusDetail.configID = 2;
                statusDetail.pingResponseMS = pingResponse;
                statusDetail.apiStatus = apiStatus;
                statusDetail.dateTime = now;
                now = addMinutes(now, 5);
                console.log(statusDetail);
                me.addAPIData(statusDetail)
                    .then(function (resp) {
                    console.log(resp);
                });
            }
            function addMinutes(date, minutes) {
                return new Date(date.getTime() + minutes * 60000);
            }
        };
        //insertAFewSampleStatus();
    };
    daHealthCheck.prototype.closePool = function () {
        pool.end(function (err) {
            // all connections in the pool have ended
        });
    };
    ;
    daHealthCheck.prototype.addTenant = function (tenant) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'INSERT INTO Tenants ';
            query += 'SET TNTName = ?, TNTCode = ?, TNTPrimaryUserID = ?, ';
            pool.query(query, [tenant.name,
                tenant.code,
                util_1.isNullOrUndefined(tenant.primaryUserID) ? null : tenant.primaryUserID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getTenantByID = function (tenantID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT * FROM Tenants ';
            query += 'WHERE TNTTenantID = ?';
            pool.query(query, [tenantID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.addAPIConfig = function (apiConfigID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'INSERT INTO APIConfigs ';
            query += 'SET CFGName = ?, CFGURI = ?, CFGEnabled = ?, ';
            query += 'CFGPollFrequencyInSeconds = ?, CFGMaxResponseTimeMS = ? ';
            query += 'WHERE CFGConfigID = ?';
            pool.query(query, [apiConfigID.name,
                apiConfigID.uri,
                apiConfigID.enabled,
                apiConfigID.pollFrequencyInSeconds,
                apiConfigID.maxResponseTimeMS,
                apiConfigID.configID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.updateAPIConfig = function (apiConfigID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'UPDATE APIConfigs SET ?';
            pool.query(query, {
                CFGName: apiConfigID.name,
                CFGTenantID: apiConfigID.tenantID,
                CFGURI: apiConfigID.uri,
                CFGEnabled: apiConfigID.enabled,
                CFGPollFrequencyInSeconds: apiConfigID.pollFrequencyInSeconds,
                CFGMaxResponseTimeMS: apiConfigID.maxResponseTimeMS
            }, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getAPIConfigAll = function () {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT * FROM APIConfigs';
            pool.query(query, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnAPIConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[i]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getAPIConfigByTenantID = function (tenantID) {
        var query = 'SELECT * FROM APIConfigs WHERE CFGTenantID = ?';
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query(query, tenantID, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnAPIConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[i]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getAPIConfigByName = function (tenantID, name) {
        var query = 'SELECT * FROM APIConfigs WHERE CFGTenantID = ? AND CFGName LIKE ?';
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query(query, [tenantID,
                '%' + name + '%'], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnAPIConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnAPIConfigs.push(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[i]));
                    }
                    resolve(returnAPIConfigs);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getAPIConfigByID = function (tenantID, apiConfigID) {
        var query = 'SELECT * FROM APIConfigs WHERE CFGTenantID = ? AND CFGConfigID LIKE ?';
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query(query, [tenantID, apiConfigID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(APIConfig_1.APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.addAPIData = function (apiStatusDetail) {
        if (apiStatusDetail.configID == null || apiStatusDetail.configID < 1) {
            throw new Error('Invalid ConfigID');
        }
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'INSERT INTO APIStatusDetails SET ?';
            pool.query(query, {
                DTAConfigID: apiStatusDetail.configID,
                DTADateTime: apiStatusDetail.dateTime == null ? moment.now() : apiStatusDetail.dateTime,
                DTAPingResponseMS: apiStatusDetail.pingResponseMS == null ? 1000 : apiStatusDetail.pingResponseMS,
                DTAStatus: apiStatusDetail.apiStatus == null ? APIStatusEnum_1.APIStatus.Unknown : apiStatusDetail.apiStatus
            }, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results.insertId);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getAPIStatusDetailsByTenantID = function (tenantID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT APIStatusDetails.* FROM APIStatusDetails ';
            query += 'JOIN APIConfigs ON APIStatusDetails.DTAConfigID = APIConfigs.CFGConfigID ';
            query += 'WHERE APIConfigs.CFGTenantID = ?';
            pool.query(query, [tenantID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getAPIStatusDetailsByAPIID = function (apiConfigID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT * FROM APIStatusDetails WHERE DTAConfigID = ?';
            pool.query(query, [apiConfigID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(results);
                }
            });
        });
    };
    ;
    return daHealthCheck;
}());
exports.daHealthCheck = daHealthCheck;
