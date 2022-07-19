require("dotenv").config();
const app = require("../app");
const jwt = require("jsonwebtoken");
const mockServer = require("supertest");
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const CommentAndPost = require("../model/commentAndPost");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const { setupGoogleSuccessResponse, setupGoogleErrorResponse } = require("./util/httpMock");

describe("post.js route, /api/post", () => {
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
        // console.log(newSubreddit._id)

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

    describe("POST request to /create/:subredditId", () => {
        test("should return 200 at create", async () => {
            // given
            const postData = {
                title: "New post",
                description: "I'm the body of the post",
            }

            //when
            const response = await client.post("/api/post/create/" + newSubreddit._id).send({
                newPost: postData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.post.title).toBe(postData.title)
        });

        test("should return 400 at create", async () => {
            // given
            const postData = {
                title: "New post",
                description: "I'm the body of the post",
            }

            //when
            const response = await client.post("/api/post/create/" + newSubreddit._id).send({}).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 404 at create - no subreddit found", async () => {
            // given
            const postData = {
                title: "New post",
                description: "I'm the body of the post",
            }
            await Subreddit.deleteMany({});

            //when
            const response = await client.post("/api/post/create/" + newSubreddit._id).send({
                newPost: postData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at create - no user found", async () => {
            // given
            const postData = {
                title: "New post",
                description: "I'm the body of the post",
            }
            await User.deleteMany({});

            //when
            const response = await client.post("/api/post/create/" + newSubreddit._id).send({
                newPost: postData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });
    });

    describe("GET request to /:postId", () => {
        test("should return 200 at get", async () => {
            // given

            //when
            const response = await client.get("/api/post/" + newPost._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.post.title).toBe(newPost.title)
            expect(response.body.comments).toStrictEqual([])
        });

        test("should return 404 at get - no post found", async () => {
            // given
            await CommentAndPost.deleteMany({});

            //when
            const response = await client.get("/api/post/" + newPost._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });
    });

    describe("PATCH request to /edit/:postId", () => {
        test("should return 200 at /edit/:postId", async () => {
            // given
            const updatePost = {
                description: "Updated description"
            }
            //when
            const response = await client.patch("/api/post/edit/" + newPost._id)
                .send({ updatePost })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.post.body).toMatch(updatePost.description)
        });

        test("should return 400 at /edit/:postId", async () => {
            // given
            const updatePost = {
                description: "Updated description"
            }
            //when
            const response = await client.patch("/api/post/edit/" + newPost._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 404 at /edit/:postId - no user found", async () => {
            // given
            const updatePost = {
                description: "Updated description"
            }
            await User.deleteMany({});

            //when
            const response = await client.patch("/api/post/edit/" + newPost._id)
                .send({ updatePost })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at /edit/:postId - no post found", async () => {
            // given
            const updatePost = {
                description: "Updated description"
            }
            await CommentAndPost.deleteMany({});

            //when
            const response = await client.patch("/api/post/edit/" + newPost._id)
                .send({ updatePost })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 403 at /edit/:postId - unauthorized", async () => {
            // given
            const updatePost = {
                description: "Updated description"
            }

            //when
            const response = await client.patch("/api/post/edit/" + newPost._id)
                .send({ updatePost })
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(403);
        });
    });
});