const mongoose = require("mongoose");

// const voteSchema = new mongoose.Schema({
//     value: { type: Number, required: true },
//     user: { type: String, required: true }
// })

const subredditSchema = new mongoose.Schema({
    creator: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    title: { type: String, unique: true, required: true },
    admins: [{ type: String, required: true }],
    members: [{ type: String, required: true }],
    createdAt: { type: Date, required: true, default: Date.now },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    // avatar: { type: String, required: true },
    // votes: [voteSchema],
});

const Subreddit = mongoose.model("subreddit", subredditSchema);

module.exports = Subreddit;