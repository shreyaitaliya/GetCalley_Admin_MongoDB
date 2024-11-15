const express = require('express');
const routes = express.Router();

const ListController = require('../controller/listController');

const TokenVerify = require('../middelware/companyToken');

module.exports = routes