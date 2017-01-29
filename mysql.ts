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
import {APIStatus} from './models/APIStatusEnum';
import {User} from './models/User';
import {isNullOrUndefined} from "util";

export class daHealthCheck {

    constructor() {
        this.init();
    }

    init() {

        let createUsers = function () {
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


        let createTenants = function () {
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


        let createAPIConfigs = function () {
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


        let insertAPIStatus = function () {
            pool.query('INSERT INTO APIStatusDetails SET ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:15', DTAPingResponseMS: 425, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

            pool.query('INSERT INTO APIStatusDetails SET ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:30', DTAPingResponseMS: 550, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

            pool.query('INSERT INTO APIStatusDetails SET ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:00:45', DTAPingResponseMS: 375, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

            pool.query('INSERT INTO APIStatusDetails SET ?',
                {DTAConfigID: 1, DTADateTime: '2016-12-31 00:01:00', DTAPingResponseMS: 375, DTAStatus: 1},
                function (error, results, fields) {
                    console.log(error);
                    console.log(results);
                });

        };
        //insertAPIStatus();

        let me = this;

        let insertAFewSampleStatus = function () {
            let now: Date = new Date();
            now = addMinutes(now, 120);

            for (let i = 0; i < 10; i++) {
                let randNum = Math.random();
                let pingResponse = Math.floor(randNum * 1200) + 350;

                let apiStatus: APIStatus = APIStatus.Up;
                if (randNum >= .8 && randNum < .92) {
                    apiStatus = APIStatus.Degraded;
                } else if (randNum >= .92 && randNum < .96) {
                    apiStatus = APIStatus.Down
                } else if (randNum >= .96) {
                    apiStatus = APIStatus.Unknown;
                }


                let statusDetail = new APIStatusDetail();
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

    }

    closePool() {
        pool.end(function (err) {
            // all connections in the pool have ended
        });
    };

    addTenant(tenant: Tenant): Promise<Number> {
        return new Promise(function (resolve, reject) {

            let query = 'INSERT INTO Tenants ';
            query += 'SET TNTName = ?, TNTCode = ?, TNTPrimaryUserID = ?, ';

            pool.query(query,
                [tenant.name,
                    tenant.code,
                    isNullOrUndefined(tenant.primaryUserID) ? null : tenant.primaryUserID],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.insertId)
                    }
                });
        });
    };


    getTenantByID(tenantID: number): Promise<Tenant> {
        return new Promise(function (resolve, reject) {

            let query = 'SELECT * FROM Tenants ';
            query += 'WHERE TNTTenantID = ?';

            pool.query(query,
                [tenantID],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results)
                    }
                });
        });
    };


    addAPIConfig(apiConfigID: APIConfig): Promise<Number> {
        return new Promise(function (resolve, reject) {

            let query = 'INSERT INTO APIConfigs ';
            query += 'SET CFGTenantID = ?, CFGName = ?, CFGURI = ?, CFGEnabled = ?, ';
            query += 'CFGPollFrequencyInSeconds = ?, CFGMaxResponseTimeMS = ? ';

            pool.query(query,
                [apiConfigID.tenantID,
                    apiConfigID.name,
                    apiConfigID.uri,
                    apiConfigID.enabled,
                    apiConfigID.pollFrequencyInSeconds,
                    apiConfigID.maxResponseTimeMS
                ],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.insertId)
                    }
                });
        });
    };

    updateAPIConfig(apiConfigID: APIConfig) {
        return new Promise(function (resolve, reject) {

            let query = 'UPDATE APIConfigs SET CFGName = ?, CFGURI = ?, CFGEnabled = ?, ';
            query += 'CFGPollFrequencyInSeconds = ?, CFGMaxResponseTimeMS = ? ';
            query += 'WHERE CFGConfigID = ? ';

            pool.query(query, [
                apiConfigID.name,
                apiConfigID.uri,
                apiConfigID.enabled,
                apiConfigID.pollFrequencyInSeconds,
                apiConfigID.maxResponseTimeMS,
                apiConfigID.configID
            ], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results)
                }
            });
        });
    };

    getAPIConfigAll() {
        return new Promise(function (resolve, reject) {

            let query = 'SELECT * FROM APIConfigs';

            pool.query(query,
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        let returnAPIConfigs = [];
                        for (let i = 0; i < results.length; i++) {
                            returnAPIConfigs.push(APIConfig.mapMySQLResultsToAPIConfig(results[i]));
                        }
                        resolve(returnAPIConfigs);
                    }
                });
        });
    };

    getAPIConfigByTenantID(tenantID: number): Promise <APIConfig[]> {

        let query = 'SELECT * FROM APIConfigs WHERE CFGTenantID = ?';

        return new Promise(function (resolve, reject) {
            pool.query(query,
                tenantID,
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        let returnAPIConfigs = [];
                        for (let i = 0; i < results.length; i++) {
                            returnAPIConfigs.push(APIConfig.mapMySQLResultsToAPIConfig(results[i]));
                        }
                        resolve(returnAPIConfigs);
                    }
                });
        });
    };


    getAPIConfigByName(tenantID: number, name: string): Promise <APIConfig[]> {

        let query = 'SELECT * FROM APIConfigs WHERE CFGTenantID = ? AND CFGName LIKE ?';

        return new Promise(function (resolve, reject) {
            pool.query(query,
                [tenantID,
                    '%' + name + '%'],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        let returnAPIConfigs = [];
                        for (let i = 0; i < results.length; i++) {
                            returnAPIConfigs.push(APIConfig.mapMySQLResultsToAPIConfig(results[i]));
                        }
                        resolve(returnAPIConfigs);
                    }
                });
        });
    };


    getAPIConfigByID(tenantID: number, apiConfigID: number): Promise <APIConfig> {

        let query = 'SELECT * FROM APIConfigs WHERE CFGTenantID = ? AND CFGConfigID LIKE ?';

        return new Promise(function (resolve, reject) {
            pool.query(query,
                [tenantID, apiConfigID],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(APIConfig.mapMySQLResultsToAPIConfig(results[0]));
                    }
                });
        });
    };

    addAPIData(apiStatusDetail: APIStatusDetail): Promise<Number> {
        if (apiStatusDetail.configID == null || apiStatusDetail.configID < 1) {
            throw new Error('Invalid ConfigID');
        }
        return new Promise(function (resolve, reject) {

            let query = 'INSERT INTO APIStatusDetails SET ?';

            pool.query(query,
                {
                    DTAConfigID: apiStatusDetail.configID,
                    DTADateTime: apiStatusDetail.dateTime == null ? moment.now() : apiStatusDetail.dateTime,
                    DTAPingResponseMS: apiStatusDetail.pingResponseMS == null ? 1000 : apiStatusDetail.pingResponseMS,
                    DTAStatus: apiStatusDetail.apiStatus == null ? APIStatus.Unknown : apiStatusDetail.apiStatus
                },
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results.insertId)
                    }
                });
        });
    };

    getAPIStatusDetailsByTenantID(tenantID: number): Promise <APIStatusDetail[]> {

        return new Promise(function (resolve, reject) {

            let query = 'SELECT APIStatusDetails.* FROM APIStatusDetails ';
            query += 'JOIN APIConfigs ON APIStatusDetails.DTAConfigID = APIConfigs.CFGConfigID ';
            query += 'WHERE APIConfigs.CFGTenantID = ?';

            pool.query(query,
                [tenantID],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        let returnAPIStatusDetails = [];
                        for (let i = 0; i < results.length; i++) {
                            returnAPIStatusDetails.push(APIStatusDetail.mapMySQLResultsToAPIStatusDetail(results[i]));
                        }
                        resolve(returnAPIStatusDetails);
                    }
                });
        });
    };

    getAPIStatusDetailsByAPIID(apiConfigID: number): Promise<APIStatusDetail[]> {

        return new Promise(function (resolve, reject) {

            let query = 'SELECT * FROM APIStatusDetails WHERE DTAConfigID = ?';

            pool.query(query,
                [apiConfigID],
                function (error, results, fields) {
                    if (error) {
                        reject(error);
                    } else {
                        let returnAPIStatusDetails = [];
                        for (let i = 0; i < results.length; i++) {
                            returnAPIStatusDetails.push(APIStatusDetail.mapMySQLResultsToAPIStatusDetail(results[i]));
                        }
                        resolve(returnAPIStatusDetails);
                    }
                });
        });
    };

}
