require("dotenv").config();
const app = require("../app");
const jwt = require("jsonwebtoken");
const mockServer = require("supertest");
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const CommentAndPost = require("../model/commentAndPost");
const { startDb, stopDb, deleteAll } = require("./util/inMemoryDb");
const { setupGoogleSuccessResponse, setupGoogleErrorResponse } = require("./util/httpMock");

describe("vote.js route, /api/vote", () => {
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

    describe("POST request to /newVote/:entityId", () => {
        test("should return 200 at create", async () => {
            // given
            const voteValue = 1;
            //when
            const response = await client.post("/api/vote/newVote/" + newComment._id).send({
                voteValue
            }).set({ authorization: tokenB });

            // then
            // console.log(response.body.entity.votes);
            // console.log(response.body.entity.votes[0]);
            // console.log(response.body.entity.votes[1].user == newUserB._id);
            expect(response.status).toBe(200);
            expect(response.body.entity.votes[1].user == newUserB._id).toBe(true);
        });

        test("should return 404 at create - no user found", async () => {
            // given
            const voteValue = 1;

            await User.deleteMany({});

            //when
            const response = await client.post("/api/vote/newVote/" + newComment._id).send({
                voteValue
            }).set({ authorization: tokenB });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at create - no entity found", async () => {
            // given
            const voteValue = 1;

            await CommentAndPost.deleteMany({});

            //when
            const response = await client.post("/api/vote/newVote/" + newComment._id).send({
                voteValue
            }).set({ authorization: tokenB });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 400 at create - missing body", async () => {
            // given
            const voteValue = 1;
            //when
            const response = await client.post("/api/vote/newVote/" + newComment._id).send({
            }).set({ authorization: tokenB });

            // then
            expect(response.status).toBe(400);
        });

        test("should return 400 at create - already voted", async () => {
            // given
            const voteValue = 1;
            //when
            const response = await client.post("/api/vote/newVote/" + newComment._id).send({
                voteValue
            }).set({ authorization: tokenA });

            // then
            // console.log(response.body.entity.votes);
            // console.log(response.body.entity.votes[0]);
            // console.log(response.body.entity.votes[1].user == newUserB._id);
            expect(response.status).toBe(400);
        });
    });

    describe("PATCH request to /updateVote/:entityId", () => {
        test("should return 200 at patch", async () => {
            // given

            //when
            const response = await client.patch("/api/vote/updateVote/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            // const indexOfVote = response.body.entity.votes.findIndex(object => object.user === newUserA._id);
            // console.log(response.body.entity.votes);
            // console.log(response.body.entity.votes[indexOfVote]);
            // console.log(response.body.entity.votes[indexOfVote].value);
            expect(response.status).toBe(200);
            expect(response.body.entity.votes[0].value).toBe(-1);
        });

        test("should return 404 at patch - user not found", async () => {
            // given
            await User.deleteMany({})

            //when
            const response = await client.patch("/api/vote/updateVote/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 404 at patch - entity not found", async () => {
            // given
            await CommentAndPost.deleteMany({})

            //when
            const response = await client.patch("/api/vote/updateVote/" + newComment._id)
                .send({})
                .set({ authorization: tokenA });

            // then
            expect(response.status).toBe(404);
        });

        test("should return 400 at patch - bad request", async () => {
            // given

            //when
            const response = await client.patch("/api/vote/updateVote/" + newComment._id)
                .send({})
                .set({ authorization: tokenB });

            // then
            expect(response.status).toBe(400);
        });

        describe("DELETE request to /deleteVote/:entityId", () => {
            test("should return 200 at create", async () => {
                // given

                //when
                const response = await client.delete("/api/vote/deleteVote/" + newComment._id)
                    .send({})
                    .set({ authorization: tokenA });

                // 
                const findIndexOfVote = response.body.entity.votes.findIndex(object => object.user === newUserA._id);
                expect(response.status).toBe(200);
                expect(findIndexOfVote).toBe(-1)
            });

            test("should return 404 at create - user not found", async () => {
                // given
                await User.deleteMany({});

                //when
                const response = await client.delete("/api/vote/deleteVote/" + newComment._id)
                    .send({})
                    .set({ authorization: tokenA });

                // 
                expect(response.status).toBe(404);
            });

            test("should return 404 at create - entity not found", async () => {
                // given
                await CommentAndPost.deleteMany({});

                //when
                const response = await client.delete("/api/vote/deleteVote/" + newComment._id)
                    .send({})
                    .set({ authorization: tokenA });

                // 
                expect(response.status).toBe(404);
            });

            test("should return 400 at create - user hasnt voted yet - bad request", async () => {
                // given

                //when
                const response = await client.delete("/api/vote/deleteVote/" + newComment._id)
                    .send({})
                    .set({ authorization: tokenB });

                // 
                expect(response.status).toBe(400);
            });
        });
    });
});