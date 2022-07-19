const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
    value: { type: Number, required: true, enum: [-1, 1] },
    user: { type: String, required: true }
})

// const idSchema = new mongoose.Schema({
//     subredditId: { type: String, required: true },
//     postId: { type: String, required: true, default: null },
//     parentId: { type: String, required: true } // ha post, akkor parentId = subredditId, ha root comment, akkor parentId = postId
// })

const commentAndPostSchema = new mongoose.Schema({
    creator: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    ids: {
        subredditId: { type: String, required: true },
        postId: { type: String },
        parentId: { type: String, required: true } // ha post, akkor parentId = subredditId, ha root comment, akkor parentId = postId
    },
    date: { type: Date, required: true, default: Date.now },
    title: { type: String }, // ha post, akkor kell title, ha comment, akkor null
    subredditTitle: { type: String },
    body: { type: String, required: true },
    edited: { type: Boolean, required: true, default: false },
    files: [{ type: String }],
    votes: [voteSchema],
    numberOfComments: { type: Number, required: true, default: 0 },
});

const CommentAndPost = mongoose.model("commentAndPost", commentAndPostSchema);

module.exports = CommentAndPost;