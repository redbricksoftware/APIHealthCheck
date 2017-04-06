"use strict";
var express = require("express");
var bodyParser = require("body-parser");
var mysql_1 = require("./mysql");
var jwt = require("express-jwt");
var fs = require("fs");
var acctDetails = require('./acctDetails.json');
var jwtCheck = jwt({
    secret: acctDetails.auth0Secret,
    audience: acctDetails.auth0ClientID
});
var port = process.env.PORT || 3000;
var deploymentType = process.env.NODE_ENV || 'development';
var app = express();
var authRouter = express.Router();
app.use(bodyParser.json({ type: "application/json" }));
var corsConfig = require('./corsConfig');
app.use(corsConfig);
var healthCheck = new mysql_1.daHealthCheck();
var v1HealthCheckRoute = require('./routes/routesbak');
authRouter.use('/config/v1/users', v1HealthCheckRoute(healthCheck));
app.use('/api', jwtCheck);
app.use('/api', authRouter);
var publicRouter = express.Router();
app.use('/public', publicRouter);
var Sequelize = require('sequelize');
var sequelize = new Sequelize(acctDetails.database, acctDetails.user, acctDetails.password, {
    host: acctDetails.host,
    dialect: 'mariadb',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});
var db = {};
fs.readdirSync('./models')
    .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js") && (file.indexOf(".js") > 0) && (file.indexOf("relations.js") !== 0);
})
    .forEach(function (file) {
    var fileName = './models/' + file;
    var model = sequelize.import(fileName);
    db[model.name] = model;
});
Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        console.log(modelName);
        db[modelName].associate(db);
    }
});
sequelize.sync({ force: true })
    .then(function () {
    db['tenant'].create({ name: 'asdfsdfdbar', code: 'abcdefasdf' })
        .then(function (model) {
        // if validation passes you will get saved model
    }).catch(Sequelize.ValidationError, function (err) {
        console.log('val error');
        for (var i = 0; i < err.errors.length; i++) {
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
module.exports = app;
