import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { redditApi } from "../api/redditApi";
import { useAuth } from "../providers/auth";

import "../styles/postView.css";
import "../styles/subreddit.css";

import LoadingMask from "../components/LoadingMask";
import PostPreview from "../components/PostPreview";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

const Subreddit = ({ setTheme }) => {
  const { get, post } = redditApi();
  const { user } = useAuth();

  const { subredditId } = useParams();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [openNewPost, setOpenNewPost] = useState(false);
  const [currentSubreddit, setCurrentSubreddit] = useState(false);
  const [currentPosts, setCurrentPosts] = useState(false);
  const [newPost, setNewPost] = useState({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const subredditPostPreviewClass = "subredditPostPreviewClass";

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenNewPost = () => {
    setOpenNewPost(true);
  };

  const handleCloseNewPost = () => {
    setOpenNewPost(false);
  };

  const getSubData = async () => {
    const response = await get(`/subreddit/getOne/${subredditId}`);
    setCurrentPosts(response.data.posts);
    setCurrentSubreddit(response.data.subreddit);
  };

  const submitNewPost = async () => {
    const response = await post(`/post/create/${subredditId}`, newPost);
    navigate(`/post/${response.data.post._id}`);
  };

  useEffect(() => {
    getSubData(); // eslint-disable-next-line
  }, [subredditId]);

  useEffect(() => {
    setNewPost({
      newPost: {
        title,
        description,
      },
    });
  }, [title, description]);

  return (
    <div className="subredditCard">
      <div className="subredditLeft">
        {currentSubreddit && currentPosts && (
          <div
            className="subredditInfo"
            style={{
              color: setTheme.postC,
              background: setTheme.postBg,
            }}
          >
            <h2>{currentSubreddit.title}</h2>
            <p>{currentSubreddit.shortDescription}</p>
            <div>
              <Button variant="outlined" onClick={handleClickOpen}>
                Read more
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Description:"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <>{currentSubreddit.description}</>
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        )}
        <div className="createNewPost">
          {currentPosts.length === 0 && (
            <p>There are no posts in this subreddit yet. Be the first!</p>
          )}
          {!user?.userId && <p>Log in to create new post!</p>}
          {user?.userId && (
            <div>
              <Button
                variant="outlined"
                onClick={handleClickOpenNewPost}
                sx={{
                  backgroundColor: setTheme.postBg,
                  color: setTheme.postC,
                  "&:hover": {
                    background: setTheme.buttonHover,
                  },
                }}
              >
                Create new post
              </Button>
              <Dialog
                open={openNewPost}
                onClose={handleCloseNewPost}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Create new post:"}
                </DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Title"
                    type="text"
                    fullWidth
                    multiline
                    variant="standard"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    color="success"
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    variant="standard"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={submitNewPost} autoFocus>
                    Save
                  </Button>
                  <Button onClick={handleCloseNewPost} autoFocus>
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </div>
      </div>
      {currentSubreddit && currentPosts ? (
        <div className="subredditPostPreview">
          {currentPosts.map((currentPost, key) => (
            <PostPreview
              currentPost={currentPost}
              currentPosts={currentPosts}
              setCurrentPosts={setCurrentPosts}
              setTheme={setTheme}
              subredditPostPreviewClass={subredditPostPreviewClass}
              key={key}
            />
          ))}
        </div>
      ) : (
        <div className="loading">
          <LoadingMask setTheme={setTheme} />
        </div>
      )}
    </div>
  );
};

export default Subreddit;
