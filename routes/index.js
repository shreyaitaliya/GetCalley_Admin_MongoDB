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

// Feedbacks Routes
routes.use('/feedback', require('../routes/feedbackRoutes'))

// SMS Routes
routes.use('/sms', require('../routes/SMSRoutes'))

// SMS Routes
routes.use('/subscription', require('../routes/subscriptionRoutes'))

// Agent Routes
routes.use('/agent', require('../routes/agentRoutes'))



module.exports = routes     