import React, { useState, useEffect } from "react";

import { redditApi } from "../../api/redditApi";

import { Button, Input } from "@mui/material";

const NewComment = ({
  setTheme,
  postToComment,
  comment,
  comments,
  setComments,
  setWriteNewComment,
  currentPost,
  setPostData,
}) => {
  const { post } = redditApi();

  const [subData, setSubData] = useState({});
  const [description, setDescription] = useState("");

  const submitNewComment = async () => {
    const response = await post(
      comment && comment?.ids?.postId
        ? "/comment/create/" + comment.ids.postId + "/" + comment._id
        : "/comment/create/" + postToComment._id + "/" + postToComment._id,
      subData
    );
    setComments([...comments, response.data.comment]);
    setDescription("");
    setWriteNewComment(false);
    if (response.status === 200) {
      setPostData((currentPost) => ({
        ...currentPost,
        numberOfComments: currentPost.numberOfComments + 1,
      }));
    }
  };

  useEffect(() => {
    setSubData({
      newComment: {
        description,
      },
    });
  }, [description]);

  return (
    <div className="newComment">
      <Input
        className="commentInput"
        type="text"
        value={description}
        multiline
        rows={3}
        placeholder="Description"
        onChange={(event) => setDescription(event.target.value)}
        sx={{
          color: setTheme.postC,
        }}
      />
      <Button
        onClick={submitNewComment}
        disabled={!description}
        sx={{
          backgroundColor: setTheme.buttonBg,
          color: setTheme.postC,
          "&:hover": {
            background: setTheme.buttonHover,
          },
        }}
      >
        Save
      </Button>
    </div>
  );
};

export default NewComment;
