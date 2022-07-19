require("dotenv").config();
const app = require("../app");
const jwt = require("jsonwebtoken");
const mockServer = require("supertest");
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const CommentAndPost = require("../model/commentAndPost");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");

describe("subreddit.js route, /api/subreddit", () => {
    let connection;
    let server;
    let client;
    let tokenA;
    let tokenB;
    let newSubreddit;
    let newPost;
    let newUserA;
    let newUserB;

    beforeAll(async () => {
        const result = await startDb();
        connection = result[0];
        server = result[1];
        client = mockServer.agent(app);
    });

    beforeEach(async () => {
        newUserA = await User.create({
            username: "TestA",
            providers: {
                google: "1234",
            },
            introduction: "Hello, my name is TestA.",
        });
        await newUserA.save();

        newUserB = new User({
            username: "TestB",
            providers: {
                google: "4321",
            },
            introduction: "Hello, my name is TestB.",
        });
        await newUserB.save();

        tokenA = jwt.sign({ userId: newUserA._id, providers: newUserA.providers }, process.env.SECRET_KEY);
        tokenB = jwt.sign({ userId: newUserB._id, providers: newUserB.providers }, process.env.SECRET_KEY);

        newSubreddit = await Subreddit.create({
            creator: {
                id: newUserA._id,
                username: newUserA.username,
            },
            title: "Test sub",
            admins: newUserA._id,
            members: newUserA._id,
            shortDescription: "Short description",
            description: "Description",
        })
        await newSubreddit.save();

        newPost = await CommentAndPost.create({
            creator: {
                id: newUserA._id,
                username: newUserA.username,
            },
            ids: {
                subredditId: newSubreddit._id,
                postId: null,
                parentId: newSubreddit._id
            },
            title: "New post",
            body: "Desc",
            votes: [{
                value: 1,
                user: newUserA._id
            }],
            numberOfComments: 0,
        });
        await newPost.save();
    })

    afterAll(async () => {
        await stopDb(connection, server);
    });

    afterEach(async () => {
        await deleteAll(User, Subreddit);
    });

    describe("POST request to /create", () => {
        test("should return 200 at create", async () => {
            // given
            const subData = {
                title: "asd",
                shortDescription: "short",
                description: "long"
            }

            //when
            const response = await client.post("/api/subreddit/create").send({
                subData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddit.title).toBe(subData.title);
        });

        test("should return 400 at create", async () => {
            // given
            const subData = {
                title: "asd",
                shortDescription: "short",
                description: "long"
            }

            //when
            const response = await client.post("/api/subreddit/create").send({}).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 400 at create", async () => {
            // given
            const subData = {
                title: "Test sub",
                shortDescription: "short",
                description: "long"
            }

            //when
            const response = await client.post("/api/subreddit/create").send({
                subData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 404 at create - user with id not found", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                title: "asd",
                shortDescription: "short",
                description: "long"
            }

            await User.deleteMany({});

            //when
            const response = await client.post("/api/subreddit/create").send({
                subData
            }).set({ authorization: token });
            // console.log(response.text)
            // then
            expect(response.status).toBe(404);
        });

    });
    describe("PATCH request to /edit", () => {
        test("should return 200 at edit - edit title", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                title: "asd",
            }

            //when
            const response = await client.patch("/api/subreddit/edit/" + newSubreddit._id).send({
                subData
            }).set({ authorization: token });
            // console.log(response.text)

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddit.title).toMatch(subData.title)
        });

        test("should return 400 at edit - edit title", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                title: "asd",
            }

            //when
            const response = await client.patch("/api/subreddit/edit/" + newSubreddit._id).send({}).set({ authorization: token });
            // console.log(response.text)

            // then
            expect(response.status).toBe(400);
        });

        test("should return 200 at edit - edit shortdescription", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                shortDescription: "short",
            }

            //when
            const response = await client.patch("/api/subreddit/edit/" + newSubreddit._id).send({
                subData
            }).set({ authorization: token });

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddit.shortDescription).toMatch(subData.shortDescription)
        });
        test("should return 200 at edit - edit shortdescription", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                description: "short",
            }

            //when
            const response = await client.patch("/api/subreddit/edit/" + newSubreddit._id).send({
                subData
            }).set({ authorization: token });

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddit.description).toMatch(subData.description)
        });

        test("should return 200 at edit - edit description", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                description: "long"
            }

            //when
            const response = await client.patch("/api/subreddit/edit/" + newSubreddit._id).send({
                subData
            }).set({ authorization: token });

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddit.description).toMatch(subData.description);
        });

        test("should return 404 at edit - no user found", async () => {
            // given
            const newUser = new User({
                username: "Test",
                providers: {
                    google: "4561",
                },
                introduction: "Hello, my name is Test.",
            });
            await newUser.save();

            const token = jwt.sign({ userId: newUser._id, providers: newUser.providers }, process.env.SECRET_KEY);

            const subData = {
                description: "long"
            }

            await User.deleteMany({});

            //when
            const response = await client.patch("/api/subreddit/edit/" + newSubreddit._id).send({
                subData
            }).set({ authorization: token });

            // then
            expect(response.status).toBe(404);
        });
    });
    describe("get request to /getAll", () => {
        test("should return 200 at getAll", async () => {
            // given

            // when
            const response = await client.get("/api/subreddit/getAll");

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddits[0].title).toMatch(newSubreddit.title);
        });
    });

    describe("get request to /getOne/:subredditId", () => {
        test("should return 200", async () => {
            // given

            // when
            const response = await client.get("/api/subreddit/getOne/" + newSubreddit._id);

            // then
            expect(response.status).toBe(200);
            expect(response.body.subreddit.title).toMatch(newSubreddit.title);
            expect(response.body.posts[0].title).toMatch(newPost.title);
        });

        test("should return 404 - no subreddit found", async () => {
            // given
            await Subreddit.deleteMany({});

            // when
            const response = await client.get("/api/subreddit/getOne/" + newSubreddit._id);

            // then
            expect(response.status).toBe(404);
        });
    });

    describe("patch request to /addMember/:subredditId", () => {
        test("should return 200", async () => {
            // given

            // when
            const response = await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(200);
            const subreddit = await Subreddit.findById(newSubreddit._id);
            expect(subreddit.members.includes(newUserB._id)).toBe(true);
        });

        test("should return 404 - user not found", async () => {
            // given
            await User.deleteMany({});

            // when
            const response = await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 - subreddit not found", async () => {
            // given
            await Subreddit.deleteMany({});

            // when
            const response = await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 400 - user already a member, bad request", async () => {
            // given

            // when
            const response = await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });
    });

    describe("delete request to /removeMember/:subredditId", () => {
        test("should return 200", async () => {
            // given
            const subData = {
                title: "asd",
                shortDescription: "short",
                description: "long"
            }

            const createSub = await client.post("/api/subreddit/create").send({
                subData
            }).set({ authorization: tokenA });

            // when
            const response = await client.delete("/api/subreddit/removeMember/" + createSub.body.subreddit._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            const subreddit = await Subreddit.findById(createSub.body.subreddit._id)
            expect(subreddit.members.includes(newUserA._id)).toBe(false);
        });

        test("should return 404 - no user found", async () => {
            // given
            await User.deleteMany({});

            // when
            const response = await client.delete("/api/subreddit/removeMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 - no subreddit found", async () => {
            // given
            await Subreddit.deleteMany({});

            // when
            const response = await client.delete("/api/subreddit/removeMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 400 - cant leave, not a member", async () => {
            // given

            // when
            const response = await client.delete("/api/subreddit/removeMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(400);
        });
    });

    describe("patch request to /addAdmin/:subredditId", () => {
        test("should return 200", async () => {
            // given
            await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            const newAdmin = newUserB.username;

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({ newAdmin })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            const subreddit = await Subreddit.findById(newSubreddit._id);
            expect(subreddit.admins.includes(newUserB._id)).toBe(true);
        });

        test("should return 400", async () => {
            // given
            await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            const newAdmin = newUserB.username;

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 404 - no subreddit found", async () => {
            // given
            await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            const newAdmin = newUserB.username;

            await Subreddit.deleteMany({});

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({ newAdmin })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 - no user found", async () => {
            // given
            await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            const newAdmin = newUserB.username;

            await User.deleteMany({});

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({ newAdmin })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 400 - user already a member", async () => {
            // given
            const newAdmin = newUserA.username;

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({ newAdmin })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 403 - unauthorized - not an admin", async () => {
            // given
            await client.patch("/api/subreddit/addMember/" + newSubreddit._id)
                .send({})
                .set({ authorization: tokenB });

            const newAdmin = newUserB.username;

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({ newAdmin })
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(403);
        });

        test("should return 404 - unauthorized - not an admin", async () => {
            // given
            const newAdmin = "Random";

            // when
            const response = await client.patch("/api/subreddit/addAdmin/" + newSubreddit._id)
                .send({ newAdmin })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });
    });
});