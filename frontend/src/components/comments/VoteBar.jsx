import React from "react";

import { useAuth } from "../../providers/auth";
import { redditApi } from "../../api/redditApi";

import { IconButton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";

const VoteBar = ({ setTheme, comment, comments, setComments }) => {
  const { user } = useAuth();
  const { post, del, patch } = redditApi();

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

  const handleUpVote = async (comment) => {
    const vote = comment.votes.find((vote) => vote.user === user.userId); // eslint-disable-next-line
    const response = await (!vote
      ? post(`/vote/newVote/${comment._id}`, { voteValue: 1 })
      : vote.value === 1
      ? del(`/vote/deleteVote/${comment._id}`)
      : patch(`/vote/updateVote/${comment._id}`));

    commentsUpdater(response.data.entity);
  };

  const handleDownVote = async (comment) => {
    const vote = comment.votes.find((vote) => vote.user === user.userId); // eslint-disable-next-line
    const response = await (!vote
      ? post(`/vote/newVote/${comment._id}`, { voteValue: -1 })
      : vote.value === -1
      ? del(`/vote/deleteVote/${comment._id}`)
      : patch(`/vote/updateVote/${comment._id}`));

    commentsUpdater(response.data.entity);
  };

  return (
    <div className="commentVote">
      <IconButton
        size="small"
        onClick={() => handleUpVote(comment)}
        sx={{ width: "24px", height: "24px" }}
      >
        <ArrowCircleUpIcon
          sx={{
            color: comment.votes.find(
              (vote) => vote.user === user?.userId && vote.value === 1
            )
              ? "green"
              : "gray",
            "&:hover": {
              color: comment.votes.find(
                (vote) => vote.user === user?.userId && vote.value === 1
              )
                ? "gray"
                : "green", // if green, make it gray
            },
          }}
        />
      </IconButton>
      <p style={{ display: "flex" }}>
        {comment.votes.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0)}
      </p>
      <IconButton
        size="small"
        onClick={() => handleDownVote(comment)}
        sx={{ width: "24px", height: "24px" }}
      >
        <ArrowCircleDownIcon
          sx={{
            color: comment.votes.find(
              (vote) => vote.user === user?.userId && vote.value === -1
            )
              ? "red"
              : "gray",
            "&:hover": {
              color: comment.votes.find(
                (vote) => vote.user === user?.userId && vote.value === -1
              )
                ? "gray"
                : "red",
            },
          }}
        />
      </IconButton>
    </div>
  );
};

export default VoteBar;
