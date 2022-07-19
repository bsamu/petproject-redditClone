const router = require("express").Router();
const User = require("../model/user");
const CommentAndPost = require("../model/commentAndPost");
const auth = require("../middleware/auth");

router.post("/newVote/:entityId", auth({ block: true }), async (req, res) => {
    if (!req.body?.voteValue) res.sendStatus(400);

    const { voteValue } = req.body;
    const entityId = req.params.entityId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const entity = await CommentAndPost.findById(entityId);

    if (!user || !entity) return res.sendStatus(404); // comment or post not found

    if (entity.votes.some(vote => vote.user === userId)) {
        return res.sendStatus(400);
    }; // user already voted on this

    entity.votes.push({
        value: voteValue,
        user: user._id
    });
    await entity.save();

    return res.status(200).json({ entity });
});

router.patch("/updateVote/:entityId", auth({ block: true }), async (req, res) => {
    const entityId = req.params.entityId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const entity = await CommentAndPost.findById(entityId);

    if (!user || !entity) return res.sendStatus(404); // comment or post not found

    const indexInEntity = entity.votes.findIndex(object => {
        return object.user === userId;
    });
    if (indexInEntity === -1) return res.sendStatus(400);; // user hasnt voted yet

    entity.votes[indexInEntity].value = entity.votes[indexInEntity].value * (-1);
    await entity.save();

    return res.status(200).json({ entity });
});

router.delete("/deleteVote/:entityId", auth({ block: true }), async (req, res) => {
    const entityId = req.params.entityId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const entity = await CommentAndPost.findById(entityId);

    if (!user || !entity) return res.sendStatus(404); // comment or post not found

    const indexInEntity = entity.votes.findIndex(object => {
        return object.user === userId;
    });
    if (indexInEntity === -1) return res.sendStatus(400); // user hasnt voted yet

    entity.votes.splice(indexInEntity, 1);
    await entity.save();

    return res.status(200).json({ entity });
});

module.exports = router;
