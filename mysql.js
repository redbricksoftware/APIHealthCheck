"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var es6_promise_1 = require("es6-promise");
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
var Config_1 = require("./modelsv1/Config");
var StatusDetail_1 = require("./modelsv1/StatusDetail");
var StatusEnum_1 = require("./modelsv1/StatusEnum");
var util_1 = require("util");
var StatusSummaryDaily_1 = require("./modelsv1/StatusSummaryDaily");
var daHealthCheck = (function () {
    function daHealthCheck() {
        this.init();
    }
    daHealthCheck.prototype.init = function () {
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
                    resolve(results.insertId);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getTenantByID = function (tenantID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT TNTTenantID, TNTName, TNTCode, TNTPrimaryUserID ';
            query += 'FROM Tenants ';
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
    //TODO: CFGEmergencyContactGroupID
    daHealthCheck.prototype.addConfig = function (config) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'INSERT INTO Configs ';
            query += 'SET CFGTenantID = ?, CFGName = ?, CFGURI = ?, CFGEnabled = ?, ';
            query += 'CFGPollFrequencyInSeconds = ?, CFGMaxResponseTimeMS = ? ';
            pool.query(query, [config.tenantID,
                config.name,
                config.uri,
                config.enabled,
                config.pollFrequencyInSeconds,
                config.maxResponseTimeMS
            ], function (error, results, fields) {
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
    daHealthCheck.prototype.updateConfig = function (config) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'UPDATE Configs SET CFGName = ?, CFGURI = ?, CFGEnabled = ?, ';
            query += 'CFGPollFrequencyInSeconds = ?, CFGMaxResponseTimeMS = ? ';
            query += 'WHERE CFGConfigID = ? ';
            pool.query(query, [
                config.name,
                config.uri,
                config.enabled,
                config.pollFrequencyInSeconds,
                config.maxResponseTimeMS,
                config.configID
            ], function (error, results, fields) {
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
    daHealthCheck.prototype.getConfigAll = function () {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT CFGConfigID, CFGTenantID, CFGName, CFGURI, ';
            query += 'CFGEnabled, CFGPollFrequencyInSeconds, CFGMaxResponseTimeMS ';
            //query += ', CFGEmergencyContactGroupID ';
            query += 'FROM Configs ';
            pool.query(query, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnConfigs = new Array();
                    for (var i = 0; i < results.length; i++) {
                        returnConfigs.push(daHealthCheck.mapMySQLResultsToConfig(results[i]));
                    }
                    resolve(returnConfigs);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getConfigByTenantID = function (tenantID) {
        var query = 'SELECT CFGConfigID, CFGTenantID, CFGName, CFGURI, ';
        query += 'CFGEnabled, CFGPollFrequencyInSeconds, CFGMaxResponseTimeMS ';
        //query += ', CFGEmergencyContactGroupID ';
        query += 'FROM Configs ';
        query += 'WHERE CFGTenantID = ?';
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query(query, tenantID, function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnConfigs.push(daHealthCheck.mapMySQLResultsToConfig(results[i]));
                    }
                    resolve(returnConfigs);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getConfigByName = function (tenantID, name) {
        var query = 'SELECT CFGConfigID, CFGTenantID, CFGName, CFGURI, ';
        query += 'CFGEnabled, CFGPollFrequencyInSeconds, CFGMaxResponseTimeMS ';
        //query += ', CFGEmergencyContactGroupID ';
        query += 'FROM Configs ';
        query += 'WHERE CFGTenantID = ? AND CFGName LIKE ?';
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query(query, [tenantID,
                '%' + name + '%'], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnConfigs = [];
                    for (var i = 0; i < results.length; i++) {
                        returnConfigs.push(daHealthCheck.mapMySQLResultsToConfig(results[i]));
                    }
                    resolve(returnConfigs);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getConfigByID = function (tenantID, config) {
        var query = 'SELECT CFGConfigID, CFGTenantID, CFGName, CFGURI, ';
        query += 'CFGEnabled, CFGPollFrequencyInSeconds, CFGMaxResponseTimeMS ';
        //query += ', CFGEmergencyContactGroupID ';
        query += 'FROM Configs ';
        query += 'WHERE CFGTenantID = ? AND CFGConfigID LIKE ?';
        return new es6_promise_1.Promise(function (resolve, reject) {
            pool.query(query, [tenantID, config], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(daHealthCheck.mapMySQLResultsToConfig(results[0]));
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.addStatusDetail = function (statusDetail) {
        if (statusDetail.configID == null || statusDetail.configID < 1) {
            throw new Error('Invalid ConfigID');
        }
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'INSERT INTO StatusDetails SET ?';
            pool.query(query, {
                DTAConfigID: statusDetail.configID,
                DTADateTime: statusDetail.dateTime == null ? moment.now() : statusDetail.dateTime,
                DTAPingResponseMS: statusDetail.pingResponseMS == null ? 1000 : statusDetail.pingResponseMS,
                DTAStatus: statusDetail.status == null ? StatusEnum_1.StatusEnum.Unknown : statusDetail.status
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
    daHealthCheck.prototype.getStatusDetailsByTenantID = function (tenantID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT DTADataID, DTAConfigID, DTADateTime, DTAPingResponseMS, ';
            query += 'DTAStatus ';
            query += 'FROM StatusDetails ';
            query += 'JOIN Configs ON StatusDetails.DTAConfigID = Configs.CFGConfigID ';
            query += 'WHERE Configs.CFGTenantID = ?';
            pool.query(query, [tenantID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnStatusDetails = [];
                    for (var i = 0; i < results.length; i++) {
                        returnStatusDetails.push(daHealthCheck.mapMySQLResultsToStatusDetail(results[i]));
                    }
                    resolve(returnStatusDetails);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.getStatusDetailsByID = function (configID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT DTADataID, DTAConfigID, DTADateTime, DTAPingResponseMS, ';
            query += 'DTAStatus ';
            query += 'FROM StatusDetails ';
            query += 'WHERE DTAConfigID = ?';
            pool.query(query, [configID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnStatusDetails = [];
                    for (var i = 0; i < results.length; i++) {
                        returnStatusDetails.push(daHealthCheck.mapMySQLResultsToStatusDetail(results[i]));
                    }
                    resolve(returnStatusDetails);
                }
            });
        });
    };
    ;
    daHealthCheck.prototype.addStatusSummary = function (statusSummary) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            if (util_1.isNullOrUndefined(statusSummary.configID)
                || util_1.isNullOrUndefined(statusSummary.date)
                || util_1.isNullOrUndefined(statusSummary.averagePingResponseMS)
                || util_1.isNullOrUndefined(statusSummary.status)
                || util_1.isNullOrUndefined(statusSummary.uptimePercent)) {
                reject('Missing required information!');
            }
            var query = 'INSERT INTO StatusSummaryDaily SET ?';
            pool.query(query, {
                SSDConfigID: statusSummary.configID,
                SSDDate: statusSummary.date,
                SSDAveragePingResponseMS: statusSummary.averagePingResponseMS,
                SSDStatus: statusSummary.status,
                SSDUptimePercent: statusSummary.uptimePercent
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
    daHealthCheck.prototype.getStatusSummaryByTenantID = function (tenantID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT SSDStatusSummaryDailyID, SSDConfigID, SSDDate, SSDAveragePingResponseMS ';
            query += 'SSDStatus, SSDUptimePercent ';
            query += 'FROM StatusSummaryDaily ';
            query += 'JOIN Configs ON StatusSummaryDaily.SSDConfigID = Configs.CFGConfigID ';
            query += 'WHERE CFGTenantID = ? ';
            pool.query(query, [tenantID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnStatusSummaryDaily = [];
                    for (var i = 0; i < results.length; i++) {
                        returnStatusSummaryDaily.push(daHealthCheck.mapMySQLResultsToStatusSummaryDaily(results[i]));
                    }
                    resolve(returnStatusSummaryDaily);
                }
            });
        });
    };
    daHealthCheck.prototype.getStatusSummaryByConfigID = function (configID) {
        return new es6_promise_1.Promise(function (resolve, reject) {
            var query = 'SELECT SSDStatusSummaryDailyID, SSDConfigID, SSDDate, SSDAveragePingResponseMS ';
            query += 'SSDStatus, SSDUptimePercent ';
            query += 'FROM StatusSummaryDaily ';
            query += 'WHERE SSDConfigID = ?';
            pool.query(query, [configID], function (error, results, fields) {
                if (error) {
                    reject(error);
                }
                else {
                    var returnStatusSummaryDaily = [];
                    for (var i = 0; i < results.length; i++) {
                        returnStatusSummaryDaily.push(daHealthCheck.mapMySQLResultsToStatusSummaryDaily(results[i]));
                    }
                    resolve(returnStatusSummaryDaily);
                }
            });
        });
    };
    daHealthCheck.mapMySQLResultsToConfig = function (val) {
        var newConfig = new Config_1.Config;
        if (val) {
            newConfig.configID = val.CFGConfigID;
            newConfig.tenantID = val.CFGTenantID;
            newConfig.name = val.CFGName;
            newConfig.uri = val.CFGURI;
            newConfig.enabled = (val.CFGEnabled === 'true' || val.CFGEnabled === 1 || val.CFGEnabled) ? true : false;
            newConfig.pollFrequencyInSeconds = val.CFGPollFrequencyInSeconds;
            newConfig.maxResponseTimeMS = val.CFGMaxResponseTimeMS;
            newConfig.emergencyContactGroupID = val.CFGEmergencyContactGroupID;
        }
        else {
            return null;
        }
        return newConfig;
    };
    daHealthCheck.mapMySQLResultsToStatusDetail = function (val) {
        var newStatusDetail = new StatusDetail_1.StatusDetail();
        if (val) {
            newStatusDetail.dataID = val.DTADataID;
            newStatusDetail.configID = val.DTAConfigID;
            newStatusDetail.dateTime = val.DTADateTime;
            newStatusDetail.pingResponseMS = val.DTAPingResponseMS;
            newStatusDetail.status = val.DTAStatus;
        }
        else {
            return null;
        }
        return newStatusDetail;
    };
    daHealthCheck.mapMySQLResultsToStatusSummaryDaily = function (val) {
        var newStatusSummaryDaily = new StatusSummaryDaily_1.StatusSummaryDaily();
        if (val) {
            newStatusSummaryDaily.summaryID = Number(val.SSDStatusSummaryDailyID);
            newStatusSummaryDaily.configID = Number(val.SSDConfigID);
            newStatusSummaryDaily.date = val.SSDDate;
            newStatusSummaryDaily.averagePingResponseMS = val.SSDAveragePingResponseMS;
            newStatusSummaryDaily.status = val.SSDStatus;
            newStatusSummaryDaily.uptimePercent = val.SSDUptimePercent;
        }
        else {
            return null;
        }
        return newStatusSummaryDaily;
    };
    return daHealthCheck;
}());
exports.daHealthCheck = daHealthCheck;
