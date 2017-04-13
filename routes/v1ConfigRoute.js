"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
//module.exports = function (healthCheck: daHealthCheck) {
module.exports = function (sequelize) {
    var returnRouter = express.Router();
    returnRouter.get('/', function (req, res) {
        sequelize['config'].findAll({})
            .then(function (configs) {
            res.json(configs);
        });
    });
    returnRouter.get('/:id', function (req, res) {
        res.json({ success: true });
    });
    returnRouter.post('/', function (req, res) {
        console.log(req.body);
        var config = sequelize['config'];
        config.enabled = req.body.enabled;
        config.pollFrequencyInSeconds = req.body.pollFrequencyInSeconds;
        config.degradedResponseTimeMS = req.body.degradedResponseTimeMS;
        config.failedResponseTimeMS = req.body.failedResponseTimeMS;
        config.expectedResponseCode = req.body.expectedResponseCode;
        config.name = req.body.name;
        config.uri = req.body.uri;
        config.port = req.body.port;
        config.protocol = req.body.protocol;
        console.log(config);
        config.create(config)
            .then(function (resp) {
            res.json(resp);
        })
            .catch(function (err) {
            res.json(err);
        });
    });
    returnRouter.put('/:id', function (req, res) {
        res.json({ success: true });
    });
    returnRouter.delete('/:id', function (req, res) {
        res.json({ success: true });
    });
    return returnRouter;
};
