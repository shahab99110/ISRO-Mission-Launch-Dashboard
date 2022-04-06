const axios = require("axios");
const launchDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

let DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunch() {
  console.log("downloading data from spacex api");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("spacex api launch data failed");
    throw new Error("failder to download spacex data");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("spacex launch data already loaded");
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
  getAllLaunch,
  addNewLaunch,
  abortLaunchById,
  existsLaunchWithId,
};
