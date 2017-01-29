const mysql = require('mysql');


const acctDetails = require('../acctDetails.json');
const connection = mysql.createConnection({
    host: acctDetails.host,
    user: acctDetails.user,
    password: acctDetails.password,
    database: acctDetails.database
});
let query = '';
connection.connect();

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


dropConfig = function () {
    query += 'DROP TABLE Configs; ';
};
createConfig = function () {
    query += 'CREATE TABLE Configs (';
    query += 'CFGConfigID INT NOT NULL AUTO_INCREMENT,';
    query += 'CFGTenantID INT NOT NULL,';
    query += 'CFGName VARCHAR(255) NOT NULL,';
    query += 'CFGURI VARCHAR(2083) NOT NULL,';
    query += 'CFGEnabled BOOLEAN NOT NULL DEFAULT TRUE,';
    query += 'CFGPollFrequencyInSeconds DECIMAL(9,4) NOT NULL,';
    query += 'CFGMaxResponseTimeMS INT NOT NULL DEFAULT 2000,';
    //TODO: update for ContactGroupID
    query += 'CFGEmergencyContactGroupID INT,';
    query += 'FOREIGN KEY (CFGEmergencyContactGroupID)';
    query += 'REFERENCES EmergencyContactGroups(ECGEmergencyContactGroupID)';
    query += 'ON DELETE SET NULL,';
    query += 'FOREIGN KEY (CFGTenantID)';
    query += 'REFERENCES Tenants(TNTTenantID)';
    query += 'ON DELETE CASCADE,';
    query += 'PRIMARY KEY(CFGConfigID)';
    query += '); '
};

dropStatusDetail = function () {
    query += 'DROP TABLE StatusDetails; ';
};
createStatusDetail = function () {
    query += 'CREATE TABLE StatusDetails (';
    query += 'DTADataID INT NOT NULL AUTO_INCREMENT,';
    query += 'DTAConfigID INT NOT NULL,';
    query += 'DTADateTime DATETIME NOT NULL,';
    query += 'DTAPingResponseMS INT NOT NULL,';
    query += 'DTAStatus INT NOT NULL,';
    query += 'FOREIGN KEY (DTAConfigID)';
    query += 'REFERENCES Configs(CFGConfigID)';
    query += 'ON DELETE CASCADE,';
    query += 'PRIMARY KEY(DTADataID)';
    query += ')';
};


dropStatusSummary = function () {
    query += 'DROP TABLE StatusSummaryDaily; ';
};
createStatusSummary = function () {

    query += 'CREATE TABLE StatusSummaryDaily (';
    query += 'SSDStatusSummaryDailyID INT NOT NULL AUTO_INCREMENT, ';
    query += 'SSDConfigID INT NOT NULL, ';
    query += 'SSDDate DATE NOT NULL, ';
    query += 'SSDAveragePingResponseMS INT NOT NULL, ';
    query += 'SSDStatus INT NOT NULL, ';
    query += 'SSDUptimePercent DECIMAL(9,4) NOT NULL, ';
    query += 'FOREIGN KEY (SSDConfigID)';
    query += 'REFERENCES Configs(CFGConfigID)';
    query += 'ON DELETE CASCADE,';
    query += 'PRIMARY KEY(SSDStatusSummaryDailyID) ';
    query += ')';
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
//dropConfig();
//createConfig();
//dropStatusDetail();
//createStatusDetail();
//dropStatusSummary();
//createStatusSummary();

console.log(query);


connection.query(query, function (error, results, fields) {
    if (error) throw error;
    console.log(results);
    //console.log('The solution is: ', results[0].solution);
});


connection.end();
