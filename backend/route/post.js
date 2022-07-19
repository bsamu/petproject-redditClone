const router = require("express").Router();
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const CommentAndPost = require("../model/commentAndPost");
const auth = require("../middleware/auth");

router.post("/create/:subredditId", auth({ block: true }), async (req, res) => {
    if (!req.body?.newPost) res.sendStatus(400);

    const { newPost } = req.body;
    const subredditId = req.params.subredditId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const subreddit = await Subreddit.findById(subredditId);

    if (!subreddit || !user || !newPost) return res.sendStatus(404); // subreddit not found

    const post = CommentAndPost({
        creator: {
            id: userId,
            username: user.username,
        },
        ids: {
            subredditId: subredditId,
            postId: null,
            parentId: subredditId
        },
        subredditTitle: subreddit.title,
        title: newPost.title,
        body: newPost.description,
        votes: [{
            value: 1,
            user: user._id
        }],
        numberOfComments: 0,
    });
    await post.save();

    res.status(200).json({ post });
});

router.get("/:postId", auth({ block: false }), async (req, res) => {
    const postId = req.params.postId;

    const post = await CommentAndPost.findById(postId);
    if (!post) return res.sendStatus(404); // post not found

    const comments = await CommentAndPost.find({ 'ids.postId': postId }).sort({ date: -1 });

    return res.status(200).json({ post, comments });
});

router.patch("/edit/:postId", auth({ block: true }), async (req, res) => {
    if (!req.body?.updatePost) res.sendStatus(400);

    const { updatePost } = req.body;
    const userId = res.locals.user.userId;
    const postId = req.params.postId;

    const user = await User.findById(userId);
    const post = await CommentAndPost.findById(postId);

    if (!post || !user || !updatePost) return res.sendStatus(404);

    if (post.creator.id !== userId) return res.sendStatus(403); // user is not the creator of the post

    post.body = updatePost.description;
    await post.save();

    return res.status(200).json({ post });
});

module.exports = router;
