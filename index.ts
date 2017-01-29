import {daHealthCheck} from './mysql';
import * as express from "express";

const port = process.env.PORT || 3000;
const deploymentType = process.env.NODE_ENV || 'development';

const acctDetails = require('./acctDetails.json');
