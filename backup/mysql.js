var mysql = require('mysql');


const acctDetails = require('./acctDetails.json');
var connection = mysql.createConnection({
    host: acctDetails.host,
    user: acctDetails.user,
    password: acctDetails.password,
    database: acctDetails.database
});
let query = '';
connection.connect();

/*
 connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
 if (error) throw error;
 console.log('The solution is: ', results[0].solution);
 });
 */


dropEmergencyContactGroup = function () {
    query += 'DROP TABLE EmergencyContactGroups; ';
};
createEmergencyContactGroup = function () {
    query += 'CREATE TABLE EmergencyContactGroups (';
    query += 'ECGEmergencyContactGroupID INT NOT NULL AUTO_INCREMENT, ';
    query += 'ECGName VARCHAR(255) NOT NULL,';
    query += 'PRIMARY KEY(ECGEmergencyContactGroupID)';
    query += '); ';
};

dropUsers = function () {
    query += 'DROP TABLE Users; ';
};
createUsers = function () {
    query += 'CREATE TABLE Users (';
    query += 'USRUserID INT NOT NULL AUTO_INCREMENT,';
    query += 'USRIdentityUserID VARCHAR(255) NOT NULL,';
    query += 'PRIMARY KEY(USRUserID)';
    query += ');';
};

dropAPIConfig = function () {
    query += 'DROP TABLE APIConfigs; ';
};
createAPIConfig = function () {
    query += 'CREATE TABLE APIConfigs (';
    query += 'CFGConfigID INT NOT NULL AUTO_INCREMENT,';
    query += 'CFGTenantID INT NOT NULL,';
    query += 'CFGName VARCHAR(255) NOT NULL,';
    query += 'CFGURI VARCHAR(2083) NOT NULL,';
    query += 'CFGEnabled BIT NOT NULL DEFAULT TRUE,';
    query += 'CFGPollFrequencyInSeconds DECIMAL(9,4) NOT NULL,';
    query += 'CFGMaxResponseTimeMS INT NOT NULL DEFAULT 2000,';
    //TODO: update for ContactGroupID
    query += 'CFGEmergencyContactGroup INT,';
    query += 'FOREIGN KEY (CFGEmergencyContactGroup)';
    query += 'REFERENCES EmergencyContactGroups(ECGEmergencyContactGroupID)';
    query += 'ON DELETE SET NULL,';
    query += 'FOREIGN KEY (CFGTenantID)';
    query += 'REFERENCES Tenants(TNTTenantID)';
    query += 'ON DELETE CASCADE,';
    query += 'PRIMARY KEY(CFGConfigID)';
    query += '); '
};

//let query = 'DROP TABLE APIDataSummary; ';
/*
 let query = 'CREATE TABLE APIDataSummary (';
 query += 'DTSDataSummaryID INT NOT NULL AUTO_INCREMENT,';
 query += 'DTSConfigID INT NOT NULL,';
 query += 'DTSStatus INT NOT NULL,';
 query += 'DTSAveragePingResponseMS INT NOT NULL,';
 query += 'DTSUpTime24H TIME NOT NULL,';
 query += 'FOREIGN KEY (DTSConfigID)';
 query += 'REFERENCES APIConfig(CFGConfigID)';
 query += 'ON DELETE CASCADE,'
 query += 'PRIMARY KEY(DTSDataSummaryID)'
 query += ')';
 */


dropAPIStatusDetail = function () {
    query += 'DROP TABLE APIStatusDetails; ';
};
createAPIStatusDetail = function () {
    query += 'CREATE TABLE APIStatusDetails (';
    query += 'DTADataID INT NOT NULL AUTO_INCREMENT,';
    query += 'DTAConfigID INT NOT NULL,';
    query += 'DTADateTime DATETIME NOT NULL,';
    query += 'DTAPingResponseMS INT NOT NULL,';
    query += 'DTAStatus INT NOT NULL,';
    query += 'FOREIGN KEY (DTAConfigID)';
    query += 'REFERENCES APIConfigs(CFGConfigID)';
    query += 'ON DELETE CASCADE,';
    query += 'PRIMARY KEY(DTADataID)';
    query += ')';
};

dropTenant = function () {
    query += 'DROP TABLE Tenants;';
};
createTenant = function () {
    query += 'CREATE TABLE Tenants (';
    query += 'TNTTenantID INT NOT NULL AUTO_INCREMENT,';
    query += 'TNTName VARCHAR(255) NOT NULL,';
    query += 'TNTCode VARCHAR(255) NOT NULL,';
    query += 'TNTPrimaryUserID INT NOT NULL,';
    query += 'FOREIGN KEY (TNTPrimaryUserID)';
    query += 'REFERENCES Users(USRUserID)';
    query += 'ON DELETE CASCADE,';
    query += 'PRIMARY KEY(TNTTenantID)';
    query += ');';
};

showTables = function () {
    query += 'show tables';
};

//showTables();
//dropUsers();
//createUsers();
//dropTenant();
//createTenant();
//dropEmergencyContactGroup();
//createEmergencyContactGroup();
//dropAPIConfig();
//createAPIConfig();
//dropAPIStatusDetail();
//createAPIStatusDetail();

//TODO: api summary

console.log(query);


connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    //console.log('The solution is: ', results[0].solution);
});


connection.end();
