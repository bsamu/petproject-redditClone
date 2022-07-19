import React from "react";

import { useAuth } from "../../providers/auth";
import { redditApi } from "../../api/redditApi";

import ReactTimeAgo from "react-time-ago";
import { IconButton } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import DeleteIcon from "@mui/icons-material/Delete";

const CommentRight = ({
  setTheme,
  comment,
  comments,
  setComments,
  writeNewComment,
  setWriteNewComment,
  writeNewCommentRoot,
  setWriteNewCommentRoot,
}) => {
  const { user } = useAuth();
  const { del } = redditApi();

  const commentsUpdater = (entity) => {
    const newState = comments.map((comment) => {
      if (comment._id === entity._id) {
        return entity;
      } else {
        return comment;
      }
    });
    setComments(newState);
  };

  const deleteComment = async (comment) => {
    const response = await del(`/comment/delete/${comment._id}`);
    commentsUpdater(response.data.comment);
  };

  const handleComment = () => {
    if (setWriteNewComment) setWriteNewComment(!writeNewComment);
    if (setWriteNewCommentRoot) setWriteNewCommentRoot(!writeNewCommentRoot);
  };

  return (
    <div className="commentRight">
      <div className="commentHeader">
        <p>
          Comment by: <span>{comment.creator.username}</span>,{" "}
          <ReactTimeAgo date={Date.parse(comment.date)} locale="en-US" />
        </p>
      </div>
      <div className="commentBody">
        <p>{comment.body}</p>
      </div>
      <div className="commentFooter">
        <IconButton
          size="small"
          onClick={handleComment}
          disabled={!user}
          sx={{
            width: "24px",
            height: "24px",
            color: setTheme.commentC,
            "&:hover": {
              color: setTheme.buttonHover,
            },
          }}
        >
          <AddCommentIcon />
        </IconButton>
        {user && comment.creator.id === user.userId && (
          <IconButton
            size="small"
            onClick={() => deleteComment(comment)}
            sx={{
              width: "24px",
              height: "24px",
              color: setTheme.commentC,
              "&:hover": {
                color: setTheme.buttonHover,
              },
            }}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default CommentRight;
