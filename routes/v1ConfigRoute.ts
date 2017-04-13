import {Sequelize} from "sequelize";
const express = require('express');

//module.exports = function (healthCheck: daHealthCheck) {
module.exports = function (tenantID: string, sequelize: Sequelize) {
    let Seq = require('sequelize');

    const returnRouter = express.Router();
    let config = sequelize['config'];

    returnRouter.get('/', function (req, res) {
        sequelize['config'].findAll({})
            .then(function (configs) {
                res.json(configs);
            })
            .catch(function (err) {
                res.json(err);
            });
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

        let newConfig = {
            enabled: req.body.enabled,
            pollFrequencyInSeconds: req.body.pollFrequencyInSeconds,
            degradedResponseTimeMS: req.body.degradedResponseTimeMS,
            failedResponseTimeMS: req.body.failedResponseTimeMS,
            expectedResponseCode: req.body.expectedResponseCode,
            uri: req.body.uri,
            name: req.body.name,
            port: req.body.port,
            protocol: req.body.protocol
        };

        console.log(newConfig);

        config.create(newConfig)
            .then((newConfig) => {
                //console.log(newConfig);
                console.log('success');
                res.json(newConfig);

            })
            .catch(Seq.ValidationError, function (err) {
                console.log('val error');
                for (let i = 0; i < err.errors.length; i++) {
                    console.log(err.errors[i].path + ': ' + err.errors[i].message);
                }
                // responds with validation errors
                res.json({success: false});
            })
            .catch(function (err) {
                console.log(err);
                res.json({success: false});
            })


        /*
         config.build(req.body)
         .validate()
         .then(function(val){
         console.log('success');
         res.json(val);
         })
         .catch(function(err){
         console.log('err');
         res.json({err: err});
         })
         */


        //res.json({success: true});
        /*

         config.create(config)
         .then(function (model) {
         res.json(model)
         // if validation passes you will get saved model
         })
         .catch(Sequelize.ValidationError, function (err) {
         console.log('val error');
         for (let i = 0; i < err.errors.length; i++) {
         console.log(err.errors[i].path + ': ' + err.errors[i].message);
         }
         // responds with validation errors
         })
         .catch(function (err) {
         console.log('other err');
         console.log(err);
         });

         */

        /*
         config.create(config)
         .then(function (resp) {
         res.json(resp);
         })
         .catch(function (err) {
         console.log(err);
         res.json(err);
         });
         */

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
            });
    });

    returnRouter.delete('/:id', function (req, res) {
        config.destroy({where: {id: req.params.id}})
            .then(function (resp) {
                res.json(resp);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    return returnRouter;
};
