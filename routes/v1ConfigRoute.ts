import {Sequelize} from "sequelize";
const express = require('express');

//module.exports = function (healthCheck: daHealthCheck) {
module.exports = function (tenantID: string, sequelize: Sequelize) {
    const returnRouter = express.Router();
    let config = sequelize['config'];

    returnRouter.get('/', function (req, res) {
        sequelize['config'].findAll({})
            .then(function (configs) {
                res.json(configs);
            })
    });

    returnRouter.get('/:id', function (req, res) {
        //config.find({where: {id: req.params.id, tenantID: tenantID}})
        config.find({where: {id: req.params.id}})
            .then(function (val) {
                console.log('Account located for id ' + req.params.id);
                res.json(val);
            })
            .catch(function (err) {
                console.log('An error occurred while searching for account ' + req.params.id);
                res.status(500).end();

            });
    });

    returnRouter.post('/', function (req, res) {

        config.enabled = req.body.enabled;
        config.pollFrequencyInSeconds = req.body.pollFrequencyInSeconds;
        config.degradedResponseTimeMS = req.body.degradedResponseTimeMS;
        config.failedResponseTimeMS = req.body.failedResponseTimeMS;
        config.expectedResponseCode = req.body.expectedResponseCode;
        config.name = req.body.name;
        config.uri = req.body.uri;
        config.port = req.body.port;
        config.protocol = req.body.protocol;

        config.create(config)
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    returnRouter.put('/:id', function (req, res) {

        //config.id = req.params.id;
        config.enabled = req.body.enabled;
        config.pollFrequencyInSeconds = req.body.pollFrequencyInSeconds;
        config.degradedResponseTimeMS = req.body.degradedResponseTimeMS;
        config.failedResponseTimeMS = req.body.failedResponseTimeMS;
        config.expectedResponseCode = req.body.expectedResponseCode;
        config.name = req.body.name;
        config.uri = req.body.uri;
        config.port = req.body.port;
        config.protocol = req.body.protocol;

        config.update(config, {where: {id: req.params.id}})
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

    returnRouter.delete('/:id', function (req, res) {
        res.json({success: true});
    });

    return returnRouter;
};
