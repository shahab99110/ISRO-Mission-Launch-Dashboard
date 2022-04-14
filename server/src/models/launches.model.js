const axios = require("axios");
const launchDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

let DEFAULT_FLIGHT_NUMBER = 100;

const ISRO_API_URL = "https://isrospacex.com/launches.json";

async function populateLaunch() {
  console.log("downloading data from isro api");
  const response = await axios.get(ISRO_API_URL);


  if (response.status !== 200) {
    console.log("isro api launch data failed");
    throw new Error("failed to download isro data");
  }
  const launchDocs = response.data.launcheList;
  for (const launchDoc of launchDocs) {
    if(launchDoc.launchDate > new Date()){
      launchDoc.upcoming = true;
    }else{
      launchDoc.upcoming = false;
    }
    launchDoc.flightNumber = DEFAULT_FLIGHT_NUMBER;
    DEFAULT_FLIGHT_NUMBER++;
    launchDoc.success = true;
    const launch = {
      flightNumber: launchDoc["flightNumber"],
      mission: launchDoc["name"],
      rocket: launchDoc["launchType"],
      launchDate: launchDoc["launchDate"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    
    };
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
   const firstLaunch = await findLaunch({
     flightNumber: 100,
     rocket: "GSLV-MK-III",
     mission: "GSLV-Mk III - M1 / Chandrayaan-2 Mission",
   });

   if (firstLaunch) {
     console.log("isro launch data already loaded");
     return;
   } else {
    await populateLaunch();
  }
}

async function existsLaunchWithId(launchId) {
  return await launchDatabase.findOne({
    flightNumber: launchId,
  });
}

async function findLaunch(filter) {
  return await launchDatabase.findOne(filter);
}

async function getAllLaunch(skip, limit) {
  return await launchDatabase
    .find({}, { _id: 0, __v: 0 })
     .sort({ flightNumber: 1 })
     .skip(skip)
     .limit(limit);
}

async function addNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("no target planet found");
  }
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customers: ["shahab", "ISRO"],
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
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunch,
  addNewLaunch,
  abortLaunchById,
};
