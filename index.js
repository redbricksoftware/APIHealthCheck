"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var mysql_1 = require('./mysql');
var healthCheck = new mysql_1.daHealthCheck();
var port = process.env.PORT || 3000;
var deploymentType = process.env.NODE_ENV || 'development';
var app = express();
var router = express.Router();
app.use('/api', router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    // Pass to next layer of middleware
    next();
});
// create application/x-www-form-urlencoded parser
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
router.get('/v1/HealthCheckManagement', function (req, res) {
    healthCheck.getAPIConfigAll()
        .then(function (resp) {
        res.json(resp);
    })
        .catch(function (err) {
        res.json(err);
    });
});
router.get('/v1/HealthCheckManagement/:id', function (req, res) {
    //console.log('Get Specific Health Check: ' + req.params.id);
    //TODO: implement token and get tenant id from token.
    healthCheck.getAPIConfigByID(1, req.params.id)
        .then(function (resp) {
        res.json(resp);
    })
        .catch(function (err) {
        res.json(err);
    });
});
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
    res.json({ 'unfound': 'abc' });
});
//TODO: delete health check by id
router.delete('/v1/HealthCheckManagement/:id', function (req, res) {
    console.log('Delete Health Check: ' + req.params.id);
    res.json({ 'unfound': 'abc' });
});
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.listen(port);
console.log('Magic happens on port ' + port);
//export = app; 
