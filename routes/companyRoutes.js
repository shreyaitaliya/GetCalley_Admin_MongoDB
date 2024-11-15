const express = require('express');

const routes = express.Router();

// controllers
const CompanyController = require('../controller/companyController');
const TokenVerify = require('../middelware/superAdminToken')

routes.post('/', TokenVerify, CompanyController.CompanyAdd);

routes.get('/:id', CompanyController.GetByID);

routes.put('/:id', CompanyController.Update);

routes.post('/login', TokenVerify, CompanyController.Login);

module.exports = routes    