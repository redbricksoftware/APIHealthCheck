'use strict';

import {daHealthCheck} from './mysql';
import * as moment from 'moment';
import * as https from 'https';
import * as http from 'http';
import * as timers from 'timers';
import {Config} from "./modelsv1/Config";
import {StatusDetail} from "./modelsv1/StatusDetail";
import * as Cron from 'Cron';
const CronJob = Cron.CronJob;


//Config Setup
const deploymentType = process.env.NODE_ENV || 'development';

let apiConfigList: Config[];

const healthCheck = new daHealthCheck();

if (deploymentType == 'production') {
    console.log('Prod!');
    healthCheck.getConfigAll()
        .then(function (resp) {
            apiConfigList = resp;
            initTimers(apiConfigList)
        })
        .catch(function (err) {
            notification(err, '');
        });
} else {
    console.log('Dev!');

    healthCheck.getConfigAll()
        .then(function (resp) {
            apiConfigList = resp;
            initTimers(apiConfigList)
        })
        .catch(function (err) {
            notification(err, '');
        });

}

console.log('done');

//Array of dynamic functions
let dyn_functions = {};
//initTimers(apiMonitoringList);


//Set initial timers
function initTimers(apiConfigList) {

    for (let i = 0; i < apiConfigList.length; i++) {
        console.log(apiConfigList[i].uri);

        addDynamicFunction(apiConfigList[i].configID,
            apiConfigList[i].name,
            apiConfigList[i].pollFrequencyInSeconds,
            apiConfigList[i].uri
        );
    }

    //example add timer. IN this case the timer exists and has a different time so its removed then added back.
    //addTimer({'configID': '7451ccd4-2e4f-4aac-b29a-81d46c23239a', 'name': 'new timer', 'pollFrequencyInSeconds': 48});

}

//Add a timer
function addTimer(apiConfig) {
    if (dyn_functions[apiConfig.configID]) {
        if (dyn_functions[apiConfig.configID]._repeat != apiConfig) {
            //remove existing timer and add new timer
            removeTimer(apiConfig);
            addTimer(apiConfig);
        }
    } else {
        addDynamicFunction(apiConfig.configID,
            apiConfig.name,
            apiConfig.pollFrequencyInSeconds,
            apiConfig.uri);
    }
}

//remove a timer
function removeTimer(apiConfig) {

    timers.clearInterval(dyn_functions[apiConfig.configID]);
    delete dyn_functions[apiConfig.configID];
}

//add a function to the function object
function addDynamicFunction(id, name, interval, uri) {

    dyn_functions[id] = timers.setInterval(function () {
        if (uri.substring(0, 5).toUpperCase() == 'HTTPS') {
            console.log('https: ' + uri);
            performHTTPSHealthCheck(id, uri, '');
        } else if (uri.substring(0, 4).toUpperCase() == 'HTTP') {
            console.log('http: ' + uri);
            performHTTPHealthCheck(id, uri, '');
        } else {
            console.error('known uri type: ' + uri);
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
            respCallback(id, res, normalizeFunction, now, moment());
        }).on('error', function (err) {
            notification(err, url)
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
            respCallback(id, res, normalizeFunction, now, moment());
        }).on('error', function (err) {
            notification(err, url)
        });
    } catch (err) {
        console.log(err);
    }
}

//TODO: notifications
function notification(err, val) {
    console.log('Error!');
    console.log(err + ' - ' + val);
}

//TODO: log response!
//Callback function when http.get succeeds.
function respCallback(id, res, normalizeFunction, start, end) {


    console.log(res.statusCode);
    //console.log(normalizeFunction);
    console.log(start.format('YYYY-MM-DD HH:mm Z'));
    console.log(end);

    console.log('differnece: ' + end.diff(start) + 'ms');

    let responseInMS = end.diff(start);
    let statusDetail: StatusDetail = new StatusDetail();
    //convert to zulu for storage
    statusDetail.dateTime = start.format('YYYY-MM-DD HH:mm Z');
    statusDetail.pingResponseMS =responseInMS;


    //TODO: update status code
    //TODO: update config id
    statusDetail.configID = id;
    statusDetail.status = res.statusCode;

    healthCheck.addStatusDetail(statusDetail)
        .then(function(resp){
            console.log(resp);
        })
        .catch(function(err){
            notification(err, id);
        });
}

//Update Summaries!
let job = new CronJob({
    cronTime: '* * 1 * * 1-5',
    //cronTime: '00 30 11 * * 1-5',
    onTick: function() {
        for(let i = 0; i < apiConfigList.length; i++){
            //TODO: async operation to summarize API statistics this node handles
            console.log(apiConfigList[i].configID);
        }
        /*
         * Runs every weekday (Monday through Friday)
         * at 11:30:00 AM. It does not run on Saturday
         * or Sunday.
         */
    },
    start: true,
    timeZone: 'UTC'
});
job.start();


