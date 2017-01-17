'use strict';

const mongoose = require('mongoose');
const mongoDBUri = 'mongodb://localhost:27017/test';
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
        console.log(res);
        return res;
    }
}


module.exports = {
    getAPIConfig: function () {
        console.log('get api config');
        apiConfig.find({}, findCallbackResults);
    },

    removeAPIConfigById: function (id) {
        apiConfig.remove({_id: id});
    },

    getAllAPIConfig: function () {

    },

    getAllActiveAPIConfig: function () {

    }
};

/*
 Example use:


 console.log(mongoose.connection.readyState);
 console.log('0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting');
 //addAPIConfig('abc', 'http://google.com', true, 20, 500, '');
 //addAPIConfig('abc2', 'http://google2.com', false);
 //addAPIConfig('abc3', 'http://google3.com', true, 50);
 //addAPIConfig('abc4', 'http://google4.com', true);

 //removeAPIConfigById('587d91b44ceef33234eafa33');
 getAPIConfig();

 */