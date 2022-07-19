import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuth } from "../providers/auth";
import { redditApi } from "../api/redditApi";

import NewComment from "./comments/NewComment";

import ReactTimeAgo from "react-time-ago";
import { IconButton } from "@mui/material";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import AddCommentIcon from "@mui/icons-material/AddComment";
import MessageIcon from "@mui/icons-material/Message";

const PostPreview = ({
  currentPost,
  setPostData,
  currentPosts,
  setCurrentPosts,
  posts,
  setPosts,
  setTheme,
  createNewComment,
  setCreateNewComment,
  postPreviewClass,
  subredditPostPreviewClass,
  postFullViewClass,
  comments,
  setComments,
}) => {
  const { user } = useAuth();
  const { post, del, patch } = redditApi();
  const navigate = useNavigate();
  const { postId } = useParams();

  const handleStates = (response) => {
    // PostFullView component
    if (setPostData) {
      setPostData(response.data.entity);
    }

    // Home component
    if (setPosts) {
      setPosts([]);
      const newState = posts.map((post) => {
        if (post._id === response.data.entity._id) {
          return response.data.entity;
        } else {
          return post;
        }
      });
      setPosts([...newState]);
    }

    // Subreddit component
    if (setCurrentPosts) {
      const newState = currentPosts.map((post) => {
        if (post._id === response.data.entity._id) {
          return response.data.entity;
        }
        return post;
      });
      setCurrentPosts(newState);
    }
  };

  const handleUpVote = async () => {
    const vote = currentPost.votes.find((vote) => vote.user === user.userId);
    const response = await (!vote
      ? post(`/vote/newVote/${currentPost._id}`, { voteValue: 1 })
      : vote.value === 1
      ? del(`/vote/deleteVote/${currentPost._id}`)
      : patch(`/vote/updateVote/${currentPost._id}`));
    handleStates(response);
  };

  const handleDownVote = async () => {
    const vote = currentPost.votes.find((vote) => vote.user === user.userId);
    const response = await (!vote
      ? post(`/vote/newVote/${currentPost._id}`, { voteValue: -1 })
      : vote.value === -1
      ? del(`/vote/deleteVote/${currentPost._id}`)
      : patch(`/vote/updateVote/${currentPost._id}`));
    handleStates(response);
  };

  const goToPost = () => {
    navigate(`/post/${currentPost._id}`);
  };

  const newComment = () => {
    if (!postId) navigate(`/post/${currentPost._id}`);
    if (postId) setCreateNewComment(!createNewComment);
  };

  useEffect(() => {}, [currentPost]);

  return (
    <div
      className={
        postPreviewClass
          ? postPreviewClass
          : subredditPostPreviewClass
          ? subredditPostPreviewClass
          : postFullViewClass
      }
      style={{
        color: setTheme.postC,
        background: setTheme.postBg,
      }}
    >
      {currentPost && (
        <div className="postCard">
          <div className="postVote">
            <IconButton
              size="small"
              onClick={handleUpVote}
              sx={{ width: "24px", height: "24px" }}
            >
              <ArrowCircleUpIcon
                sx={{
                  color: currentPost.votes.find(
                    (vote) => vote.user === user?.userId && vote.value === 1
                  )
                    ? "green"
                    : "gray",
                  "&:hover": {
                    color: currentPost.votes.find(
                      (vote) => vote.user === user?.userId && vote.value === 1
                    )
                      ? "gray"
                      : "green",
                  },
                }}
              />
            </IconButton>
            <p>
              {currentPost.votes.reduce((accumulator, object) => {
                return accumulator + object.value;
              }, 0)}
            </p>
            <IconButton
              size="small"
              onClick={handleDownVote}
              sx={{ width: "24px", height: "24px" }}
            >
              <ArrowCircleDownIcon
                sx={{
                  color: currentPost.votes.find(
                    (vote) => vote.user === user?.userId && vote.value === -1
                  )
                    ? "red"
                    : "gray",
                  "&:hover": {
                    color: currentPost.votes.find(
                      (vote) => vote.user === user?.userId && vote.value === -1
                    )
                      ? "gray"
                      : "red",
                  },
                }}
              />
            </IconButton>
          </div>
          {/* endOfPostVote */}
          <div className="postRight">
            <div className="postHeader">
              <p>
                Posted by: <span>{currentPost.creator.username}</span> at{" "}
                <span
                  className="subredditTitle"
                  onClick={() =>
                    navigate(`/subreddit/${currentPost.ids.subredditId}`)
                  }
                >
                  {currentPost.subredditTitle}
                </span>
                ,{" "}
                <ReactTimeAgo
                  date={Date.parse(currentPost.date)}
                  locale="en-US"
                />
              </p>
            </div>
            <div className="postBody">
              {currentPost.title && (
                <h3
                  onClick={goToPost}
                  sx={{
                    "&:hover": {
                      color: setTheme.buttonHover,
                    },
                  }}
                >
                  {currentPost.title}
                </h3>
              )}
              <p>{currentPost.body}</p>
            </div>
            <div className="postFooter">
              <IconButton
                size="small"
                onClick={newComment}
                disabled={!user}
                sx={{
                  width: "24px",
                  height: "24px",
                  color: setTheme.postC,
                  "&:hover": {
                    color: setTheme.buttonHover,
                  },
                }}
              >
                <AddCommentIcon />
              </IconButton>
              <span onClick={goToPost}>
                {currentPost.numberOfComments}{" "}
                <MessageIcon
                  sx={{
                    "&:hover": {
                      color: setTheme.buttonHover,
                    },
                  }}
                />
              </span>
            </div>
          </div>
          {/* endOfPostRight */}
        </div>
      )}
      {createNewComment && (
        <NewComment
          setTheme={setTheme}
          postToComment={currentPost}
          comments={comments}
          setComments={setComments}
          setWriteNewComment={setCreateNewComment}
          currentPost={currentPost}
          setPostData={setPostData}
        />
      )}
    </div>
  );
};

export default PostPreview;
