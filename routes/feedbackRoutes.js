const express = require('express');
const routes = express.Router();

const feedbackController = require('../controller/feedbackController');
const TokenVerify = require('../middelware/companyToken');

routes.post('/', TokenVerify, feedbackController.AddFeedback);

routes.get('/', feedbackController.GetAllData);

routes.get('/:id', feedbackController.GetByID);

routes.put('/:id', feedbackController.Update);

routes.delete('/:id', feedbackController.Delete);

module.exports = routes;