'use strict';

const mongoose = require('mongoose');


const mongoUser = process.env.NODE_ENV || '';
const mongoPass = process.env.NODE_ENV || '';
const mongoUrl = process.env.NODE_ENV || 'localhost';
const mongoPort = process.env.NODE_ENV || '27017';
const mongoDB = process.env.NODE_ENV || 'test';


const mongoDBUri = 'mongodb://' + mongoUser + (mongoUser != '' ? ':' : '') + mongoPass + (mongoUser != '' ? '@' : '') + mongoUrl + ':' + mongoPort + '/' + mongoDB;
console.log(mongoDBUri);
//mongoose.connect('mongodb://localhost/test');
mongoose.connect(mongoDBUri, {config: {autoIndex: false}});

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + mongoDBUri);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

const Schema = mongoose.Schema;

//Schemas
const apiConfigSchema = require('./mongoSchemas/apiConfigSchema');
let apiConfig = mongoose.model('apiConfig', apiConfigSchema);

function addAPIConfig(name, uri, enabled, pollFrequencyInSeconds, maxResponseTimeMS, emergencyContactGroup) {

    if (name != null && name != undefined) {

        let newApiConfig = new apiConfig({
            name: name == undefined || null ? uri : name,
            uri: uri,
            enabled: enabled == undefined || null ? true : enabled,
            pollFrequencyInSeconds: pollFrequencyInSeconds == undefined || null ? 600 : pollFrequencyInSeconds,
            maxResponseTimeMS: maxResponseTimeMS == undefined || null ? 2500 : maxResponseTimeMS,
            emergencyContactGroup: emergencyContactGroup == undefined || null ? '' : emergencyContactGroup
        });

        newApiConfig.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('meow');
            }
        });
        return true;
    } else {
        return false;
    }

}


function findCallbackResults(err, res) {
    if (err) {
        console.log('error getting results: ');
        console.log(err);
    } else {
        console.log('abc');
        return res;
    }
}

module.exports.getAPIConfig = function (callback) {
    apiConfig.find({}).exec(function (err, res) {
        callback(err, res);
    });
};

module.exports.getAPIConfigByID = function (id, callback) {
    console.log(id);
    apiConfig.find({'_id': id}).exec(function (err, res) {
        callback(err, res);
    });
};


module.exports.addAPIConfig = function (name, uri, enabled, pollFrequencyInSeconds, maxResponseTimeMS, emergencyContactGroup, callback) {
    console.log(name + ' - ' + uri + ' - ' + enabled);
    if (name != null && name != undefined) {

        let newApiConfig = new apiConfig({
            name: name == undefined || null ? uri : name,
            uri: uri,
            enabled: enabled == undefined || null ? true : enabled,
            pollFrequencyInSeconds: pollFrequencyInSeconds == undefined || null ? 600 : pollFrequencyInSeconds,
            maxResponseTimeMS: maxResponseTimeMS == undefined || null ? 2500 : maxResponseTimeMS,
            emergencyContactGroup: emergencyContactGroup == undefined || null ? '' : emergencyContactGroup
        });

        newApiConfig.save(function (err) {
            if (err) {
                callback(err, '');
            } else {
                callback(null, true);
            }
        });
    } else {
        callback('name cannot be null', '');
    }
};


//module.exports = apiConfig;

/*
 module.exports = new Promise((res, err) => {
 apiConfig.find({}, findCallbackResults);
 //setTimeout(resolve.bind(null, 'someValueToBeReturned'), 2000);
 });
 */

/*
 exports.auth = function(user, pass, callback){
 User.findOne(...., function(err, user){
 var result = !!user;
 callback(err, result);
 });
 }
 */

/*
 module.exports = {
 getAPIConfig: function () {
 console.log('get api config');
 return apiConfig.find({}, findCallbackResults);
 },

 removeAPIConfigById: function (id) {
 apiConfig.remove({_id: id});
 },

 getAllAPIConfig: function () {

 },

 getAllActiveAPIConfig: function () {

 }
 };
 */