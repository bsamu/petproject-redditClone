const mongoose = require("mongoose");

// const voteSchema = new mongoose.Schema({
//     value: { type: Number, required: true },
//     votedId: { type: String, required: true }
// })

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    providers: {
        google: { type: String, sparse: true, unique: true },
    },
    karma: { type: Number },
    introduction: { type: String, required: true },
    adminAt: [{ type: String }], // subredditek idja
    memberAt: [{ type: String }],
    // posts: [{ type: String, required: true }],
    // comments: [{ type: String, required: true }],
    date: { type: Date, required: true, default: Date.now },
    // votes: [voteSchema]
});

const User = mongoose.model("user", userSchema);

module.exports = User;