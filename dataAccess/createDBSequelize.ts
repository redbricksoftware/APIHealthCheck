import * as fs from "fs";
const acctDetails = require('../devHelper/acctDetails.json');

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
        console.log(file);
        let fileName = '../models/' + file;
        let model = sequelize.import(fileName);
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        console.log(modelName);
        db[modelName].associate(db);
    }
});

//Run Sync tables!
//set foreignkeychecks = 0 removes ordering issues.
sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(
    function () {
        sequelize.sync({force: true})
            .then(function () {

                sequelize.query('SET FOREIGN_KEY_CHECKS = 1').then(function () {


                    /*
                     //Sample Data
                     db['user'].create({identityUserID: 'abcdef'})
                     .then(function () {
                     db['tenant'].create({name: 'asdfsdfdbar', code: 'abcdefasdf'})
                     .then(function (model) {
                     // if validation passes you will get saved model
                     }).catch(Sequelize.ValidationError, function (err) {
                     console.log('val error');
                     for (let i = 0; i < err.errors.length; i++) {
                     console.log(err.errors[i].path + ': ' + err.errors[i].message);
                     }
                     // responds with validation errors
                     }).catch(function (err) {
                     console.log('other err');
                     console.log(err);
                     // every other error
                     });
                     });

                     */
                }, function (err) {
                    console.log('An error occurred while creating the table:', err);
                });
            });
    }
);

module.exports = db;