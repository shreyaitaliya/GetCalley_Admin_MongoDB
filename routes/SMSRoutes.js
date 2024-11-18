const express = require('express');

const routes = express.Router();

const smsController = require('../controller/SMSController');

const TokenVerify = require('../middelware/companyToken');

routes.post('/', TokenVerify, smsController.AddSms)

routes.get('/', smsController.GetByAllData);

routes.get('/:id', smsController.GetByID);

routes.put('/:id', smsController.Update);

routes.delete('/:id', smsController.Delete);

module.exports = routes