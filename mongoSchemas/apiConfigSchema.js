'use strict';

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let apiConfigSchema = new Schema({
    name: String,
    uri: {type: String, index: true},
    enabled: Boolean,
    pollFrequencyInSeconds: Number,
    maxResponseTimeMS: Number,
    emergencyContactGroup: String
});

module.exports = apiConfigSchema;
