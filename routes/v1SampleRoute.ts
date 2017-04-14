const express = require('express');

module.exports = function () {
    const returnRouter = express.Router();

    returnRouter.post('/', function (req, res) {

        Object.keys(req.body).forEach(function(key,index) {
            console.log(key);
            console.log(req.body[key]);
        });

        res.json({successful: true});

    });

    return returnRouter;
};
