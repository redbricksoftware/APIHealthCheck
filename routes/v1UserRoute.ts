import {Sequelize} from "sequelize";
import {isNullOrUndefined, isObject} from "util";
const express = require('express');

//module.exports = function (healthCheck: daHealthCheck) {
module.exports = function (tenantID: string, sequelize: Sequelize) {
    let Seq = require('sequelize');

    const returnRouter = express.Router();
    let model = sequelize['user'];

    returnRouter.get('/', function (req, res) {

        model.findAll({})
            .then(function (response) {
                res.json(response);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    returnRouter.get('/:id', function (req, res) {
        //config.find({where: {id: req.params.id, tenantID: tenantID}})
        model.find({where: {id: req.params.id}})
            .then(function (response) {
                console.log('Account located for id ' + req.params.id);
                res.json(response);
            })
            .catch(function (err) {
                console.log('An error occurred while searching for account ' + req.params.id);
                res.status(500).end();

            });
    });

    returnRouter.post('/', function (req, res) {

        let newUser = {
            identityUserID: req.body.identityUserID,
            email: req.body.email
        };

        model.create(newUser)
            .then((response) => {
                res.json(response);

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

    });

    returnRouter.put('/:id', function (req, res) {

        let newUser = {
            identityUserID: req.body.identityUserID,
            email: req.body.email
        };

        model.update(newUser, {where: {id: req.params.id}})
            .then(function (response) {
                res.json(response);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    returnRouter.delete('/:id', function (req, res) {
        model.destroy({where: {id: req.params.id}})
            .then(function (response) {
                res.json(response);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    returnRouter.patch('/:id', function (req, res) {

        let patchObjectProperties = require('./helperLibrary/patchObjectProperties');
        let patchObject = patchObjectProperties(req.body, model);

        model.update(patchObject, {where: {id: req.params.id}})
            .then(function (response) {
                res.json(response);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    return returnRouter;
};
