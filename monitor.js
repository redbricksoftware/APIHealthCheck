'use strict';

//Config Setup
const deploymentType = process.env.NODE_ENV || 'development';

const timer = require('timers');
const https = require('https');
const http = require('http');
const moment = require('moment');


let apiMonitoringList = {};
let apiSummaryList = {};
let apiDetailList = {};

if (deploymentType == 'production') {
    //TODO: get apis from stash
} else {
    apiMonitoringList = require('./sampleAPIConfig.json');
    apiSummaryList = require('./sampleAPISummary.json');
    apiDetailList = require('./sampleAPIDetail.json');

    if (typeof (apiMonitoringList) != 'object') {
        apiMonitoringList = JSON.parse(apiMonitoringList);
        apiSummaryList = JSON.parse(apiSummaryList);
        apiDetailList = JSON.parse(apiDetailList);
    }
}

//Array of dynamic functions
var dyn_functions = {};
initTimers(apiMonitoringList);


//Set initial timers
function initTimers(apiConfigList) {

    for (let i = 0; i < apiConfigList.data.length; i++) {
        console.log(apiConfigList.data[i]._id);

        addDynamicFunction(apiConfigList.data[i]._id,
            apiConfigList.data[i].name,
            apiConfigList.data[i].pollFrequencyInSeconds,
            apiConfigList.data[i].uri
        );
    }

    //example add timer. IN this case the timer exists and has a different time so its removed then added back.
    //addTimer({'_id': '7451ccd4-2e4f-4aac-b29a-81d46c23239a', 'name': 'new timer', 'pollFrequencyInSeconds': 48});

}

//Add a timer
function addTimer(apiConfig) {
    if (dyn_functions[apiConfig._id]) {
        if (dyn_functions[apiConfig._id]._repeat != apiConfig) {
            //remove existing timer and add new timer
            removeTimer(apiConfig);
            addTimer(apiConfig);
        }
    } else {
        addDynamicFunction(apiConfig._id,
            apiConfig.name,
            apiConfig.pollFrequencyInSeconds,
            apiConfig.uri);
    }
}

//remove a timer
function removeTimer(apiConfig) {
    timer.clearInterval(dyn_functions[apiConfig._id]);
    delete dyn_functions[apiConfig._id];
}

//add a function to the function object
function addDynamicFunction(id, name, interval, uri) {
    dyn_functions[id] = timer.setInterval(function () {
        if (uri.substring(0, 5).toUpperCase() == 'HTTPS') {
            console.log('https: ' + uri);
            performHTTPSHealthCheck(id, uri, '');
        } else {
            console.log('http: ' + uri);
            performHTTPHealthCheck(id, uri, '');
        }
    }, secondsToMS(interval));
}


function secondsToMS(seconds) {
    return seconds * 1000;
}

//HTTPS health check
function performHTTPSHealthCheck(id, url, normalizeFunction) {
    var now = moment();

    try {
        https.get(url, function (res) {
            console.log("statusCode: ", res.statusCode);
            respCallback(res, normalizeFunction, now, moment());
        }).on('error', function (err) {
            console.log(err + ' - ' + url);
        });
    } catch (err) {
        console.log(err);
    }
}

//HTTP health check
function performHTTPHealthCheck(id, url, normalizeFunction) {
    var now = moment();

    console.log(url);
    try {
        http.get(url, function (res) {
            console.log("statusCode: ", res.statusCode);
            respCallback(res, normalizeFunction, now, moment());
        }).on('error', function (err) {
            console.log(err + ' - ' + url);
        });
    } catch (err) {
        console.log(err);
    }
}

//TODO: notifications
function notification() {
    console.log('Error!');
}

//TODO: log response!
//Callback function when http.get succeeds.
function respCallback(res, normalizeFunction, start, end) {

    var dataResult;

    console.log(res.statusCode);
    console.log(normalizeFunction);
    console.log(start);
    console.log(end);

    console.log('differnece: ' + end.diff(start) + 'ms');

    res.on('data', (data) => {
        //process.stdout.write(data);
        dataResult += data;
    });

    res.on('end', () => {
        //dyn_functions[normalizeFunction](dataResult);
        //console.log(dataResult);
    });
}
