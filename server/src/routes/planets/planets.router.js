const express = require('express');
const {httpGetAllPlanets} = require('./plantes.controller');

const planetRouter = express.Router();

planetRouter.get('/', httpGetAllPlanets)

module.exports = planetRouter;