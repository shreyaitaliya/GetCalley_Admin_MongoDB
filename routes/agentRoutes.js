const express = require('express');
const routes = express.Router();

const AgentController = require('../controller/agentController');

const TokenVerify = require('../middelware/companyToken');

routes.post('/', TokenVerify, AgentController.AddAgent);

routes.get('/', AgentController.GetByAllData);

routes.get('/:id', AgentController.GetByID);

routes.put('/:id', AgentController.Update);

routes.delete('/:id', AgentController.Delete);

module.exports = routes