const postId = 10

const comments = [
    {
        id: 11,
        ids: {
            parentId: 10,
            postId: 10,
        },
        body: "first rootcomment",
        children: [21, 22]
    },
    {
        id: 21,
        ids: {
            parentId: 11,
            postId: 10,
        },
        body: "first rootcomment's 1st nested",
        children: [31]
    },
    {
        id: 22,
        ids: {
            parentId: 11,
            postId: 10,
        },
        body: "first rootcomment's 2nd nested",
        children: []
    },
    {
        id: 23,
        ids: {
            parentId: 12,
            postId: 10,
        },
        body: "second rootcomment's 1st nested",
        children: []
    },
    {
        id: 12,
        ids: {
            parentId: 10,
            postId: 10,
        },
        body: "second rootcomment",
        children: [23]
    },
    {
        id: 13,
        ids: {
            parentId: 10,
            postId: 10,
        },
        body: "third rootcomment",
        children: []
    },
    {
        id: 31,
        ids: {
            parentId: 21,
            postId: 10,
        },
        body: "first rootcomment's 1st nested's nested",
        children: []
    }
];

const renderComments = (comment) => {
    console.log(comment.body)
    if (comment.children.length !== 0) renderComments(comment)
}

const rootComments = comments.filter((comment) => comment.ids.parentId === comment.ids.postId);

rootComments.map((comment) => {
    renderComments(comment, comments)
    // if (comment.children.length !== 0) renderComments(comment)
})


const filteredComments = comments
    .filter((comment) => comment.ids.parentId === comment.ids.postId)
    .map((comment, key) => {
        if (comment.children.length !== 0) console.log("Childkommentek: ", comment.children)
        console.log("---------------")
    });
