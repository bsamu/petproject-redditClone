const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");

const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

const homeRoutes = require("./route/home.js");
const userRoutes = require("./route/user.js");
const subredditRoutes = require("./route/subreddit.js");
const postRoutes = require("./route/post.js");
const commentRoutes = require("./route/comment.js");
const voteRoutes = require("./route/vote.js");

morgan.token("host", function (req, res) {
    return req.hostname;
});

app.use(cors());
app.use(express.json()); // body-ban erkezo json-t parse-olni tudja
app.use(morgan(":method :url :status - HOST: :host  - :response-time ms")); // use this middleware on every request

app.use("/api/home", homeRoutes);
app.use("/api/user", userRoutes);
app.use("/api/subreddit", subredditRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/vote", voteRoutes);

app.get("/", (req, res) => {
    // console.log("Health check completed");
    res.sendStatus(200);
});

app.use(errorHandler);

module.exports = app;

/*

*/