'use strict';
//Config Setup
const port = process.env.PORT || 3000;
const deploymentType = process.env.NODE_ENV || 'development';

const express = require('express');
const timer = require('timers');
const bodyParser = require('body-parser');
const https = require('https');
const moment = require('moment');

//Express server
const app = express();
//API Router
const router = express.Router();


app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});




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

router.get('/v1/HealthCheckSummary', function (req, res) {
    res.json(apiSummaryList);
});

router.get('/v1/HealthCheckDetail/:id', function (req, res) {
    let id = req.params.id;

    console.log(id);

    let returnDetail;

    for (let i = 0; i < apiDetailList.data.length; i++) {
        if (apiDetailList.data[i].id == id) {
            returnDetail = apiDetailList.data[i];
        }
    }

    res.json(returnDetail);
});

router.get('/v1/HealthCheckDetail', function (req, res) {
    res.json(apiDetailList);
});


//TODO: get list of health checks
router.get('/v1/HealthCheckManagement', function (req, res) {
    res.json(apiMonitoringList);
});

//TODO: get single health check by id
router.get('/v1/HealthCheckManagement/:id', function (req, res) {

    if (!apiMonitoringList[req.params.id]) {
        res.json({'notfound': req.params.id});
    } else {
        res.json(apiMonitoringList[req.params.id]);
    }

});

// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlEncodedParser = bodyParser.urlencoded({extended: false})

//TODO: post add new health checks
//Include urlEncodedParser to read req.body and parse to json.
router.post('/v1/HealthCheckManagement', urlEncodedParser, function (req, res) {
    console.log('new Health Check');
    console.log(req.body);
    //generate new id after adding and return to user.
    req.body.id = 'newid';
    console.log(req.body);
    res.json(req.body);
});

//TODO: put update health check by id
router.put('/v1/HealthCheckManagement/:id', function (req, res) {
    console.log('Update Health Check: ' + req.params.id);
    res.json(apiMonitoringList);
});

//TODO: delete health check by id
router.delete('/v1/HealthCheckManagement/:id', function (req, res) {
    console.log('Delete Health Check: ' + req.params.id);
    res.json(apiMonitoringList);
});


app.get('/', function (req, res) {
    res.send('Hello World!')
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
let server = app.listen(port);
console.log('Magic happens on port ' + port);

//Export server for chai testing
module.exports = server;

/*
 //Array of data shapping dynamic functions
 var dyn_functions = {};
 //Need anonymous function in order to pass parameter value to callback function (writeconsole).
 dyn_functions['timer1'] = timer.setInterval(function () {
 writeConsole('timer1')
 }, 3000);
 //Example that cannot have a parameter
 dyn_functions['timer2'] = timer.setInterval(writeConsole, 5000);
 */

function writeConsole(val) {
    console.log(val);
    console.log(dyn_functions);
    //timer.clearInterval(dyn_functions['timer1']);
}


performHealthCheck('https://www.google.com', 'abc');

function performHealthCheck(url, normalizeFunction) {
    var now = moment();

    https.get(url, function (res) {
        httpsCallback(res, normalizeFunction, now, moment());
    });
}

function httpsCallback(res, normalizeFunction, start, end) {

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


const mongoose = require('mongoose');

function saveRecord(record) {
    console.log(record);
}


saveRecord('abcdef');

function saveRecord2() {
    mongoose.connect('mongodb://localhost/test');

    var healthCheckSummarySchema = mongoose.Schema({
        name: String,
        uri: String,
        currentStatus: String,
        responseTimeMS: Number,
        uptime24h: Number,
        icon: String,
        rowStatus: String,
    });

    var healthCheckData = mongoose.model('HealthCheck', healthCheckSummarySchema);

    var newHealthCheckTest = new healthCheckData({name: 'abc', uri: 'def', currentStatus: 'Up'});
    console.log(newHealthCheckTest.name); // 'Silence'

    /*
    newHealthCheckTest.save(function (err, newHealthCheckTest) {
        if (err) return console.error(err);
        //fluffy.speak();
    });

    var query = healthCheckData.find({ 'name': 'abc' });

    query.exec(function (err, person) {
        if (err) {
            return handleError(err);
        } else {
            console.log(person);
        }
    })
    */
}

function printDef(a,b,c) {
    console.log('printDef')
    console.log(a);
    console.log(b);
    console.log(c);
}
