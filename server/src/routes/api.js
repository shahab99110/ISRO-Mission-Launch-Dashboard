const express = require('express')

const planetRouter = require('./planets/planets.router');
const launchsRouter = require('./launches/launches.router');

const api = express.Router()

api.use("/planets", planetRouter);
api.use("/launches", launchsRouter);

module.exports = api;