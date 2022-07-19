require("dotenv").config();
const app = require("../app");
const jwt = require("jsonwebtoken");
const mockServer = require("supertest");
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");

describe("errorhandler.js and auth.js middlewares", () => {
    let connection;
    let server;
    let client;
    let badToken = "badToken";

    beforeAll(async () => {
        const result = await startDb();
        connection = result[0];
        server = result[1];
        client = mockServer.agent(app);
    });

    afterAll(async () => {
        await stopDb(connection, server);
    });

    afterEach(async () => {
        await deleteAll(User, Subreddit);
    });

    test("should return 500 at create - errorHandler caught req - bad providers structure", async () => {
        // given
        const subData = {
            title: "asd",
            shortDescription: "short",
            description: "long"
        }

        const token = jwt.sign({ userId: "random", providers: "nono" }, process.env.SECRET_KEY);

        //when
        const response = await client.post("/api/subreddit/create").send({
            subData
        }).set({ authorization: token });

        // then
        expect(response.status).toBe(500);
    });

    test("should return 401 at create - auth caught req - no token", async () => {
        // given
        const subData = {
            title: "asd",
            shortDescription: "short",
            description: "long"
        }

        const token = jwt.sign({ userId: "random", providers: "nono" }, process.env.SECRET_KEY);

        //when
        const response = await client.post("/api/subreddit/create").send({
            subData
        })

        // then
        expect(response.status).toBe(401);
    });

    test("should return 401 at create - bad token", async () => {
        // given
        const subData = {
            title: "asd",
            shortDescription: "short",
            description: "long"
        }

        //when
        const response = await client.post("/api/subreddit/create").send({
            subData
        }).set({ authorization: badToken });

        // then
        expect(response.status).toBe(401);
    });
});