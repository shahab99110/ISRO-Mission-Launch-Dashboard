const { getAllPlanets } = require("../../models/plantes.model");

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
}

module.exports = {
  httpGetAllPlanets,
};
