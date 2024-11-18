const express = require('express');

const routes = express.Router();

const subscriptionController = require('../controller/subscriptionController')

const TokenVerify = require('../middelware/companyToken')

module.exports = routes