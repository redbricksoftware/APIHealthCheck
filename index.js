"use strict";
var port = process.env.PORT || 3000;
var deploymentType = process.env.NODE_ENV || 'development';
var acctDetails = require('./acctDetails.json');
