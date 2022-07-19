const router = require("express").Router();
const User = require("../model/user");
const CommentAndPost = require("../model/commentAndPost");
const auth = require("../middleware/auth");

router.post("/create/:postId/:parentId", auth({ block: true }), async (req, res) => {
    if (!req.body?.newComment) res.sendStatus(400);

    const { newComment } = req.body;
    const userId = res.locals.user.userId;
    const postId = req.params.postId;
    const parentId = req.params.parentId;

    const user = await User.findById(userId);
    const parent = await CommentAndPost.findById(parentId);
    const post = await CommentAndPost.findById(postId);

    if (!post || !parent || !user || !newComment) return res.sendStatus(404); // post not found

    const comment = CommentAndPost({
        creator: {
            id: userId,
            username: user.username,
        },
        ids: {
            subredditId: parent.ids.subredditId,
            postId: post._id,
            parentId: parentId
        },
        body: newComment.description,
        votes: [{
            value: 1,
            user: user._id
        }],
        numberOfComments: 0,
    });
    await comment.save();

    if (postId === parentId) {
        post.numberOfComments++;
        await post.save();
    } else {
        post.numberOfComments++;
        await post.save();

        parent.numberOfComments++;
        await parent.save()
    }

    res.status(200).json({ comment, user });
});

router.delete("/delete/:commentId", auth({ block: true }), async (req, res) => {
    const userId = res.locals.user.userId;

    const commentId = req.params.commentId;

    const user = await User.findById(userId);
    const comment = await CommentAndPost.findById(commentId);

    if (!comment || !user) return res.sendStatus(404); // post not found

    if (comment.creator.id !== userId) return res.sendStatus(403); // user not the creator

    comment.creator.id = "[Deleted]";
    comment.creator.username = "[Deleted]";
    comment.body = "[Deleted comment]";
    await comment.save();

    res.status(200).json({ comment });
});

router.patch("/edit/:commentId", auth({ block: true }), async (req, res) => {
    if (!req.body?.updateComment) res.sendStatus(400);

    const { updateComment } = req.body;
    const userId = res.locals.user.userId;
    const commentId = req.params.commentId;

    const user = await User.findById(userId);
    const comment = await CommentAndPost.findById(commentId);

    if (!comment || !user) return res.sendStatus(404); // comment not found

    if (comment.creator.id !== userId) return res.sendStatus(403); // user not the creator

    comment.body = updateComment.description;
    comment.date = Date.now();
    comment.edited = true;
    await comment.save();

    return res.status(200).json({ comment });
});

module.exports = router;
