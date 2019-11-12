'use strict';

const express = require('express');

const IndexController = require('./controllers/IndexController');
const ActivityController = require('./controllers/ActivityControlle');

const routes = express.Router();

routes.get('/', IndexController.index);
routes.post('/login', IndexController.login);
routes.post('/logout', IndexController.logout);

routes.post('/journeybuilder/save/', ActivityController.save);
routes.post('/journeybuilder/validate/', ActivityController.validate);
routes.post('/journeybuilder/publish/', ActivityController.publish);
routes.post('/journeybuilder/execute/', ActivityController.execute);

module.exports = routes;