const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches api", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET/launches", () => {
    test("it should pass 200", async () => {
      const response = await request(app).get("/launches");
      expect(response.statusCode).toBe(200);
    });
  });

  describe("Test POST/launches", () => {
    const completeLaunchData = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
      launchDate: "january 4, 2028",
    };
    const launchDataWithoutDate = {
      mission: "USS Enterprise",
      rocket: "NCC 1701-D",
      target: "Kepler-62 f",
    };

    test("it should return 201", async () => {
      const response = await request(app)
        .post("/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);
      const reqDate = new Date(completeLaunchData.launchDate).valueOf();
      const resDate = new Date(response.body.launchDate).valueOf();
      expect(resDate).toBe(reqDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("it should respone to 400", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "missing required launch property",
      });
    });
  });
});
