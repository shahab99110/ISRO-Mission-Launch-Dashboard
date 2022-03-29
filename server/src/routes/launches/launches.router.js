const express = require("express");
const { httpGetAllLaunch, httpAddNewLaunch, httpAbortLaunch } = require("./launches.controller");

const launchsRouter = express.Router();

launchsRouter.get('/', httpGetAllLaunch);
launchsRouter.post('/', httpAddNewLaunch);
launchsRouter.delete('/:id', httpAbortLaunch)

module.exports = launchsRouter;

