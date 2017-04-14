import express = require('express');
import bodyParser = require('body-parser');
import jwt = require("express-jwt");

const acctDetails = require('./devHelper/acctDetails.json');

const sequelize = require('./dataAccess/createDBSequelize');

const jwtCheck = jwt({
    secret: acctDetails.auth0Secret,
    audience: acctDetails.auth0ClientID
});

const port = process.env.PORT || 3000;
const deploymentType = process.env.NODE_ENV || 'development';

const app = express();
const authRouter = express.Router();
const publicRouter = express.Router();
app.use(bodyParser.json({type: "application/json"}));

let corsConfig = require('./corsConfig');
app.use(corsConfig);


//region Routes

let v1ConfigRoute = require('./routes/v1ConfigRoute');
authRouter.use('/v1/config', v1ConfigRoute('abc', sequelize));
//authRouter.use('/v1/config', v1HealthCheckRoute(healthCheck));

let v1HealthCheckDetailRoute = require('./routes/v1HealthCheckDetailRoute');
authRouter.use('/v1/healthCheckDetail', v1HealthCheckDetailRoute('abc', sequelize));

let v1UserRoute = require('./routes/v1UserRoute');
authRouter.use('/v1/user', v1UserRoute('abc', sequelize));

let v1TenantRoute = require('./routes/v1TenantRoute');
authRouter.use('/v1/tenant', v1TenantRoute('abc', sequelize));

let v1sampleRoute = require('./routes/v1SampleRoute');
authRouter.use('/v1/sample', v1sampleRoute());

//endregion

//app.use('/api', jwtCheck);
app.use('/api', authRouter);
//app.use('/api', publicRouter);


app.listen(port);
console.log('Magic happens on port ' + port);

export = app;
