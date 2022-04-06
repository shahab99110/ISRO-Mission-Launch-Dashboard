const {
  getAllLaunch,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

const {getPagination} = require('../../services/query');

async function httpGetAllLaunch(req, res) {
  //return res.status(201).json({message:"controller tk aa gaya"});
  const {skip,limit} = getPagination(req.query);
  const launches = await getAllLaunch(skip, limit)
  return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
  
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "missing required launch property",
    });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "invalid date",
    });
  }
  await addNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;
const existLaunch = await existsLaunchWithId(launchId)
  if (!existLaunch){
    return res.status(404).json({
      error: "Launch does not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  console.log(aborted);
  return res.status(200).json(aborted);

 }

module.exports = {
  httpGetAllLaunch,
  httpAddNewLaunch,
  httpAbortLaunch,
};
