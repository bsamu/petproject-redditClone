const router = require("express").Router();
const User = require("../model/user");
const Subreddit = require("../model/subreddit");
const CommentAndPost = require("../model/commentAndPost");
const auth = require("../middleware/auth");

router.post("/create", auth({ block: true }), async (req, res) => {
    if (!req.body?.subData) res.sendStatus(400);

    const { subData } = req.body;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const existingSubreddit = await Subreddit.findOne({ title: subData.title });

    if (!subData || !user) return res.sendStatus(404); // user not found
    if (existingSubreddit) return res.sendStatus(400); // subreddit already exists

    const subreddit = Subreddit({
        creator: {
            id: userId,
            username: user.username,
        },
        title: subData.title,
        admins: user._id,
        members: user._id,
        shortDescription: subData.shortDescription,
        description: subData.description,
    });
    await subreddit.save()

    user.adminAt.push(subreddit._id);
    user.memberAt.push(subreddit._id);
    await user.save();

    res.status(200).json({ subreddit, user });
});

router.patch("/edit/:subredditId", auth({ block: true }), async (req, res) => {
    if (!req.body?.subData) res.sendStatus(400);

    const { subData } = req.body;
    const subredditId = req.params.subredditId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const subreddit = await Subreddit.findById(subredditId);

    if ((!subData.title && !subData.shortDescription && !subData.description) || !user || !subreddit) return res.sendStatus(404); // subreddit not found

    if (subData.title) {
        subreddit.title = subData.title;
        await subreddit.save();
        return res.status(200).json({ subreddit });
    }

    if (subData.shortDescription) {
        subreddit.shortDescription = subData.shortDescription;
        await subreddit.save();
        return res.status(200).json({ subreddit });
    }

    if (subData.description) {
        subreddit.description = subData.description;
        await subreddit.save();
        return res.status(200).json({ subreddit });
    }

    // res.sendStatus(400);
})

router.get("/getAll", auth({ block: false }), async (req, res) => {
    const subreddits = await Subreddit.find({});

    res.status(200).json({ subreddits });
});

router.get("/getOne/:subredditId", auth({ block: false }), async (req, res) => {
    const subredditId = req.params.subredditId;

    const subreddit = await Subreddit.findById(subredditId);

    if (!subreddit) return res.sendStatus(404); // subreddit not found

    const posts = await CommentAndPost.find({ 'ids.parentId': subredditId }).sort({ date: -1 });

    res.status(200).json({ subreddit, posts });
});

router.patch("/addMember/:subredditId", auth({ block: true }), async (req, res) => {
    const subredditId = req.params.subredditId;
    const userId = res.locals.user.userId;

    const subreddit = await Subreddit.findById(subredditId);
    const user = await User.findById(userId);

    if (!user || !subreddit) return res.sendStatus(404); // user not found

    if (subreddit.members.includes(userId)) return res.sendStatus(400);

    subreddit.members.push(userId);
    await subreddit.save();

    user.memberAt.push(subredditId);
    await user.save();

    res.status(200).json({ subreddit });
})

router.delete("/removeMember/:subredditId", auth({ block: true }), async (req, res) => {
    // to leave, but probably later a remove function for admins will be implemented
    const subredditId = req.params.subredditId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const subreddit = await Subreddit.findById(subredditId);

    if (!user || !subreddit) return res.sendStatus(404); // user not found

    const indexOfMember = subreddit.members.indexOf(user._id);

    if (indexOfMember === -1) return res.sendStatus(400);

    subreddit.members.splice(indexOfMember, 1);

    const indexOfSubreddit = user.memberAt.indexOf(subredditId);
    user.memberAt.splice(indexOfSubreddit, 1);

    if (subreddit.admins.includes(user._id)) {
        // console.log("Delete if-ben vagyok")
        const indexOfAdmin = subreddit.admins.indexOf(user._id);
        subreddit.admins.splice(indexOfAdmin, 1);

        const indexOfSubreddit = user.adminAt.indexOf(subredditId);
        user.adminAt.splice(indexOfSubreddit, 1);
    }

    await subreddit.save();
    await user.save();

    res.status(200).json({ subreddit });
})

router.patch("/addAdmin/:subredditId", auth({ block: true }), async (req, res) => {
    if (!req.body?.newAdmin) res.sendStatus(400);

    const { newAdmin } = req.body;
    const subredditId = req.params.subredditId;
    const userId = res.locals.user.userId;

    const user = await User.findById(userId);
    const subreddit = await Subreddit.findById(subredditId);

    if (!user || !subreddit) return res.sendStatus(404); // user not found

    if (!subreddit.admins.includes(userId)) return res.sendStatus(403);
    // eddig azt néztük, hogy van-e joga a felhasználónak admint hozzáadni

    const newAdminToAdd = await User.findOne({ username: newAdmin });

    if (!newAdminToAdd) return res.sendStatus(404); // user not found

    if (subreddit.admins.includes(newAdminToAdd._id)) return res.sendStatus(400);

    subreddit.admins.push(newAdminToAdd._id);
    await subreddit.save();
    newAdminToAdd.adminAt.push(subredditId);
    await newAdminToAdd.save();

    res.status(200).json({ subreddit });
})

module.exports = router;
