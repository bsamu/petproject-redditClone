require("dotenv").config();
const app = require("../app");
const jwt = require("jsonwebtoken");
const mockServer = require("supertest");
const User = require("../model/user");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const { setupGoogleSuccessResponse, setupGoogleErrorResponse } = require("./util/httpMock");

describe("user.js route, /api/user", () => {
    let connection;
    let server;
    let client;

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
        await deleteAll(User);
    });
    describe("POST requests to api/user/login", () => {
        test("should return 400 without body", async () => {
            // given

            // when
            const response = await client.post("/api/user/login").send({});

            // then
            // console.log(response.body)
            expect(response.status).toBe(400);
        });

        test("should return 400 without provider", async () => {
            // given
            const code = "random";

            // when
            const response = await client.post("/api/user/login").send({ code });

            // then
            expect(response.status).toBe(400);
        });

        test("should return random without params", async () => {
            // given
            const code = "random";

            // when
            const response = await client.post("/api/user/login");

            // then
            expect(response.status).toBe(400);
        });

        test("should return 400 without code", async () => {
            // given
            const provider = "github";

            // when
            const response = await client.post("/api/user/login").send({ provider });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 400 with invalid provider (user not created)", async () => {
            // given
            const code = "random";
            const provider = "gitlab";

            // when
            const response = await client.post("/api/user/login").send({
                code,
                provider,
            });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 200 with valid provider id (user not created)", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            setupGoogleSuccessResponse("7458tygbhf78");

            // when
            const response = await client.post("/api/user/login").send({
                code,
                provider,
            });

            // then
            expect(response.status).toBe(200);
        });

        test("should return 200 with jwt valid provider id (user not created)", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            // when
            const response = await client.post("/api/user/login").send({
                code,
                provider,
            });

            // then
            expect(response.status).toBe(200);
            const responseToken = jwt.decode(response.body.token);
            expect(responseToken.providers.google).toBe(googleUserId);
            const users = await User.find();
            expect(users).toStrictEqual([]);
        });

        test("should return 401 with invalid code (user not created)", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            setupGoogleErrorResponse();

            // when
            const response = await client.post("/api/user/login").send({
                code,
                provider,
            });

            // then
            expect(response.status).toBe(401);
            expect(response.body).toStrictEqual({});
            const users = await User.find();
            expect(users).toStrictEqual([]);
        });

    });

    describe("POST request to /api/user/create", () => {
        test("should return 200 at register", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });
            // when

            const response = await client.post("/api/user/create").send({
                username,
                introduction
            }).set({ authorization: login.body.token });

            // then
            expect(response.status).toBe(200);
            const responseToken = jwt.decode(response.body.token);
            expect(responseToken.providers.google).toBe(googleUserId);
            const user = await User.findOne({ 'providers.google': googleUserId });
            expect(user.username).toBe("Test User");
        });

        test("should return 400 at register - missing body params", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });
            // when

            const response = await client.post("/api/user/create").set({ authorization: login.body.token });

            // then
            expect(response.status).toBe(400);
        });
    });

    describe("GET request to /getUser", () => {
        test("should return 200 at getUser", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });

            const register = await client.post("/api/user/create").send({
                username,
                introduction
            }).set({ authorization: login.body.token });

            // when
            const response = await client.get("/api/user/getUser").set({ authorization: register.body.token });

            // then
            expect(response.status).toBe(200);
            expect(response.body.user.username).toBe(username);
        });

        test("should return 404 at getUser - user not found", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });

            const register = await client.post("/api/user/create").send({
                username,
                introduction
            }).set({ authorization: login.body.token });

            await User.deleteMany({});

            // when
            const response = await client.get("/api/user/getUser").set({ authorization: register.body.token });

            // then
            expect(response.status).toBe(404);
        });
    });

    describe("PATCH request to /edit", () => {
        test("should return 200 at edit", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const updateInfo = {
                introduction: "Yo",
            }

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });

            const register = await client.post("/api/user/create").send({
                username,
                introduction
            }).set({ authorization: login.body.token });

            // when

            const response = await client.patch("/api/user/edit").send({
                updateInfo
            }).set({ authorization: register.body.token });

            // then
            expect(response.status).toBe(200);
            const user = await User.findOne({ username });
            expect(user.introduction).toMatch(updateInfo.introduction);
        });

        test("should return 404 at edit", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const updateInfo = {
                introduction: "Yo",
            }

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });

            const register = await client.post("/api/user/create").send({
                username,
                introduction
            }).set({ authorization: login.body.token });

            await User.deleteMany({});

            // when
            const response = await client.patch("/api/user/edit").send({
                updateInfo
            }).set({ authorization: register.body.token });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 400 at edit", async () => {
            // given
            const code = "4/0AX4XfWigRi0tflCcAhGM5WngKa5_199L1dJjayorTpuSj0z4AlQbnIyZSs78wBXHO3HG_g";
            const provider = "google";
            const googleUserId = "vshdg674t7ryfgb";
            setupGoogleSuccessResponse(googleUserId);

            const username = "Test User";
            const introduction = "Hello, it's me, the tester."

            const updateInfo = {
                introduction: "Yo",
            }

            const login = await client.post("/api/user/login").send({
                code,
                provider,
            });

            const register = await client.post("/api/user/create").send({
                username,
                introduction
            }).set({ authorization: login.body.token });

            // when
            const response = await client.patch("/api/user/edit").send({}).set({ authorization: register.body.token });

            // then
            expect(response.status).toBe(400);
        });
    });
});