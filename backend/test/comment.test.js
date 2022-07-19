require("dotenv").config();
const app = require("../app");
const jwt = require("jsonwebtoken");
const mockServer = require("supertest");
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const CommentAndPost = require("../model/commentAndPost");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");

describe("comment.js route, /api/comment", () => {
    let connection;
    let server;
    let client;
    let tokenA;
    let tokenB;
    let newSubreddit;
    let newPost;
    let newUserA;
    let newUserB;
    let newComment;

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

        newComment = CommentAndPost({
            creator: {
                id: newUserA._id,
                username: newUserA.username,
            },
            ids: {
                subredditId: newSubreddit._id,
                postId: newPost._id,
                parentId: newSubreddit._id
            },
            body: "New comment",
            votes: [{
                value: 1,
                user: newUserA._id
            }],
            numberOfComments: 0,
        });
        await newComment.save();
    })

    afterAll(async () => {
        await stopDb(connection, server);
    });

    afterEach(async () => {
        await deleteAll(User, Subreddit);
    });

    describe("POST request to /create/:postId/:parentId", () => {
        test("should return 200 at create", async () => {
            // given
            const commentData = {
                description: "I'm the body of the post",
            }

            //when
            const response = await client.post("/api/comment/create/" + newPost._id + "/" + newComment._id).send({
                newComment: commentData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.comment.body).toBe(commentData.description)
        });

        test("should return 200 at create", async () => {
            // given
            const commentData = {
                description: "I'm the body of the post",
            }

            //when
            const response = await client.post("/api/comment/create/" + newPost._id + "/" + newPost._id).send({
                newComment: commentData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.comment.body).toBe(commentData.description)
        });

        test("should return 400 at create", async () => {
            // given
            const commentData = {
                description: "I'm the body of the post",
            }

            //when
            const response = await client.post("/api/comment/create/" + newPost._id + "/" + newComment._id).send({}).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 404 at create - no user found", async () => {
            // given
            const commentData = {
                description: "I'm the body of the post",
            }

            await User.deleteMany({});
            //when
            const response = await client.post("/api/comment/create/" + newPost._id + "/" + newPost._id).send({
                newComment: commentData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at create - no parent or post found", async () => {
            // given
            const commentData = {
                description: "I'm the body of the post",
            }

            await CommentAndPost.deleteMany({});

            //when
            const response = await client.post("/api/comment/create/" + newPost._id + "/" + newPost._id).send({
                newComment: commentData
            }).set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });
    });

    describe("DELETE request to /comment/delete/:commentId", () => {
        test("should return 200 at delete", async () => {
            // given

            //when
            const response = await client.delete("/api/comment/delete/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.comment.body).toBe("[Deleted comment]")
        });

        test("should return 404 at delete - no user found", async () => {
            // given
            await User.deleteMany({});

            //when
            const response = await client.delete("/api/comment/delete/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at delete - no comment found", async () => {
            // given
            await CommentAndPost.deleteMany({});

            //when
            const response = await client.delete("/api/comment/delete/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 403 at delete - unauthorized", async () => {
            // given

            //when
            const response = await client.delete("/api/comment/delete/" + newComment._id)
                .send({})
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(403);
        });
    });

    describe("PATCH request to /edit/:commentId", () => {
        test("should return 200 at patch", async () => {
            // given
            const updateComment = {
                description: "Updated comment"
            }
            //when
            const response = await client.patch("/api/comment/edit/" + newComment._id)
                .send({ updateComment })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(200);
            expect(response.body.comment.body).toBe(updateComment.description)
        });

        test("should return 400 at patch", async () => {
            // given
            const updateComment = {
                description: "Updated comment"
            }
            //when
            const response = await client.patch("/api/comment/edit/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 404 at patch - no user found", async () => {
            // given
            const updateComment = {
                description: "Updated comment"
            }
            await User.deleteMany({});

            //when
            const response = await client.patch("/api/comment/edit/" + newComment._id)
                .send({ updateComment })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at patch - no comment found", async () => {
            // given
            const updateComment = {
                description: "Updated comment"
            }
            await CommentAndPost.deleteMany({});

            //when
            const response = await client.patch("/api/comment/edit/" + newComment._id)
                .send({ updateComment })
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 403 at patch - unauthorized", async () => {
            // given
            const updateComment = {
                description: "Updated comment"
            }

            //when
            const response = await client.patch("/api/comment/edit/" + newComment._id)
                .send({ updateComment })
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(403);
        });
    });
});