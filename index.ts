import express = require('express');
import path = require('path');
import logger = require('morgan');
import bodyParser = require('body-parser');
import {daHealthCheck} from './mysql';


import * as jwt from "express-jwt";
import * as fs from "fs";

const acctDetails = require('./acctDetails.json');

const jwtCheck = jwt({
    secret: acctDetails.auth0Secret,
    audience: acctDetails.auth0ClientID
});

const port = process.env.PORT || 3000;
const deploymentType = process.env.NODE_ENV || 'development';

const app = express();
const authRouter = express.Router();
app.use(bodyParser.json({type: "application/json"}));

let corsConfig = require('./corsConfig');
app.use(corsConfig);

const healthCheck = new daHealthCheck();
let v1HealthCheckRoute = require('./routes/routesbak');
authRouter.use('/config/v1/users', v1HealthCheckRoute(healthCheck));

app.use('/api', jwtCheck);
app.use('/api', authRouter);


const publicRouter = express.Router();
app.use('/public', publicRouter);


let Sequelize = require('sequelize');
let sequelize = new Sequelize(acctDetails.database, acctDetails.user, acctDetails.password, {
    host: acctDetails.host,
    dialect: 'mariadb',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});


let db = {};

fs.readdirSync('./models')
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js") && (file.indexOf(".js") > 0) && (file.indexOf("relations.js") !== 0 );
    })
    .forEach(function (file) {
        let fileName = './models/' + file;
        let model = sequelize.import(fileName);
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        console.log(modelName);
        db[modelName].associate(db);
    }
});

sequelize.sync({force: true})
    .then(function () {

        db['tenant'].create({name: 'asdfsdfdbar', code: 'abcdefasdf'})
            .then(function (model) {
                // if validation passes you will get saved model
            }).catch(Sequelize.ValidationError, function (err) {
            console.log('val error');
            for(let i = 0; i < err.errors.length; i++){
                console.log(err.errors[i].path + ': ' + err.errors[i].message);
            }
            // responds with validation errors
        }).catch(function (err) {
            console.log('other err');
            console.log(err);
            // every other error
        });

        //db['tenant'].addTenant('abcdasdfefg', 'abcdeasdfasdffg', 'asdfasdfasdc')

    }, function (err) {
        console.log('An error occurred while creating the table:', err);
    });


app.listen(port);
console.log('Magic happens on port ' + port);

export = app;


