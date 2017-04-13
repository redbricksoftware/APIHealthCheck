import {Sequelize} from "sequelize";
const express = require('express');

//module.exports = function (healthCheck: daHealthCheck) {
module.exports = function (sequelize) {
    const returnRouter = express.Router();

    returnRouter.get('/', function (req, res) {
        sequelize['config'].findAll({})
            .then(function (configs) {
                res.json(configs);
            })
    });

    returnRouter.get('/:id', function (req, res) {
        res.json({success: true});
    });

    returnRouter.post('/', function (req, res) {
        let config = sequelize['config'];
        config.name = 'abc';
        config.uri = 'localhost';
        config.port = 334;
        config.protocol = 'https'
        sequelize['config'].create(config)
            .then(function(config){
                res.json(config);
            })
    });

    returnRouter.put('/:id', function (req, res) {
        res.json({success: true});
    });

    returnRouter.delete('/:id', function (req, res) {
        res.json({success: true});
    });

    return returnRouter;
};
