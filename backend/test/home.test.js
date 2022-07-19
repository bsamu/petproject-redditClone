require("dotenv").config();
const app = require("../app");
const mockServer = require("supertest");
const User = require("../model/user");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");

describe("home.js route, /api/user", () => {
    let connection;
    let server;
    let client;

    beforeAll(async () => {
        const result = await startDb();
        connection = result[0];
        server = result[1];
        client = mockServer.agent(app);

        const newUser = new User({
            username: "Test User",
            providers: {
                google: "1234",
            },
            introduction: "Hello there!",
        });
        await newUser.save();
    });

    afterAll(async () => {
        await stopDb(connection, server);
    });

    afterEach(async () => {
        await deleteAll(User);
    });

    describe("GET request to /", () => {
        test("should return 200 at /", async () => {
            // given

            // when
            const response = await client.get("/api/home");

            // then
            expect(response.status).toBe(200);
            expect(response.body.posts).toStrictEqual([]);
        });
    });
});