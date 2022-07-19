const router = require("express").Router();
const CommentAndPost = require("../model/commentAndPost");
const auth = require("../middleware/auth");

router.get("/", auth({ block: false }), async (req, res) => {
    const posts = await CommentAndPost.find({ 'ids.postId': null }).sort({ date: -1 }).limit(10);

    return res.status(200).json({ posts });
});

module.exports = router;
