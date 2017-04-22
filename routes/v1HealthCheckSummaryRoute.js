"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var express = require('express');
//TODO: get tenant from UserID
//module.exports = function (healthCheck: daHealthCheck) {
module.exports = function (tenantID, sequelize) {
    var Seq = require('sequelize');
    var returnRouter = express.Router();
    var model = sequelize['healthCheckSummary'];
    returnRouter.get('/', function (req, res) {
        var query = {};
        for (var prop in req.query) {
            switch (prop.trim().toLowerCase()) {
                case 'startdate':
                    query['requestDate'] = {
                        $gte: req.query[prop]
                    };
                    break;
                case 'enddate':
                    query['requestDate'] = {
                        $lte: req.query[prop]
                    };
                    break;
            }
        }
        model.findAll({ where: query })
            .then(function (response) {
            res.json(response);
        })
            .catch(function (err) {
            res.json(err);
        });
    });
    returnRouter.get('/:id', function (req, res) {
        //config.find({where: {id: req.params.id, tenantID: tenantID}})
        model.find({ where: { id: req.params.id } })
            .then(function (response) {
            console.log('Account located for id ' + req.params.id);
            if (util_1.isNullOrUndefined(response)) {
                res.json({});
            }
            else {
                res.json(response);
            }
        })
            .catch(function (err) {
            console.log('An error occurred while searching for account ' + req.params.id);
            res.status(500).end();
        });
    });
    returnRouter.post('/', function (req, res) {
        var newHealthCheckDetail = {
            uri: req.body.uri,
            requestDate: req.body.requestDate,
            averageRequestLengthMS: req.body.averageRequestLengthMS,
            activeResponsePercent: req.body.activeResponsePercent,
            degradedResponsePercent: req.body.degradedResponsePercent,
            failedResponsePercent: req.body.failedResponsePercent,
            otherResponsePercent: req.body.otherResponsePercent,
            tenantID: req.body.tenantID,
            configID: req.body.configID
        };
        model.create(newHealthCheckDetail)
            .then(function (response) {
            res.json(response);
        })
            .catch(Seq.ValidationError, function (err) {
            console.log('val error');
            for (var i = 0; i < err.errors.length; i++) {
                console.log(err.errors[i].path + ': ' + err.errors[i].message);
            }
            // responds with validation errors
            res.json({ success: false });
        })
            .catch(function (err) {
            console.log(err);
            res.json({ success: false });
        });
    });
    returnRouter.put('/:id', function (req, res) {
        var newHealthCheckDetail = {
            uri: req.body.uri,
            requestDate: req.body.requestDate,
            averageRequestLengthMS: req.body.averageRequestLengthMS,
            activeResponsePercent: req.body.activeResponsePercent,
            degradedResponsePercent: req.body.degradedResponsePercent,
            failedResponsePercent: req.body.failedResponsePercent,
            otherResponsePercent: req.body.otherResponsePercent,
            tenantID: req.body.tenantID,
            configID: req.body.configID
        };
        model.update(newHealthCheckDetail, { where: { id: req.params.id } })
            .then(function (response) {
            res.json(response);
        })
            .catch(function (err) {
            res.json(err);
        });
    });
    returnRouter.delete('/:id', function (req, res) {
        model.destroy({ where: { id: req.params.id } })
            .then(function (response) {
            res.json(response);
        })
            .catch(function (err) {
            res.json(err);
        });
    });
    returnRouter.patch('/:id', function (req, res) {
        var patchObjectProperties = require('./helperLibrary/patchObjectProperties');
        var patchObject = patchObjectProperties(req.body, model);
        model.update(patchObject, { where: { id: req.params.id } })
            .then(function (response) {
            res.json(response);
        })
            .catch(function (err) {
            res.json(err);
        });
    });
    return returnRouter;
};
