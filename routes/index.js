const express = require('express');
const routes = express.Router();

const superAdmincontroller = require('../controller/superAdminController')

routes.post('/', superAdmincontroller.Login);


// Company Routes
routes.use('/company', require('../routes/companyRoutes'));

// ExcelFile Routes
routes.use('/excelfile', require('../routes/bulkExcelRoutes'));

// List Routes
routes.use('/list', require('../routes/listRoutes'))

module.exports = routes     