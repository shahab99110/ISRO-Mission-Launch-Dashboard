const launchDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customer: ["ISRO, SHAHAB"],
  upcoming: true,
  success: true,
};

saveLaunch(launch);

async function existsLaunchWithId(launchId) {
  return await launchDatabase.findOne({
    flightNumber: launchId,
  });
}

async function getAllLaunch() {
  // const haha = {
  //   message: 'test',
  // }
  // console.log(await launchDatabase.find())
  // console.log(haha)
  // return haha;

  return await launchDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function addNewLaunch(launch) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customer: ["shahab", "ISRO"],
    flightNumber: newFlightNumber,
    upcoming: true,
    success: true,
  });
  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  return await launchDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      success: false,
      upcoming: false,
    }
  );

  // return aborted.ok === 1 && aborted.nModified === 1;
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch.flightNumber;
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("no target planet found");
  }
  await launchDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

module.exports = {
  getAllLaunch,
  addNewLaunch,
  abortLaunchById,
  existsLaunchWithId,
};
