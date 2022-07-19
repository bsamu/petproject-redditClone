import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../providers/auth";
import { redditApi } from "../api/redditApi";

import "../styles/createSubreddit.css";

import { Button, Input } from "@mui/material";

const CreateSubreddit = ({ options, setOptions, setTheme }) => {
  const { user } = useAuth();
  const { post } = redditApi();
  const navigate = useNavigate();

  const [subData, setSubData] = useState({});
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [subredditId, setSubredditId] = useState("");
  const previousValues = useRef({ subredditId });

  const sortArray = (x, y) => {
    if (x.title.toLowerCase() < y.title.toLowerCase()) {
      return -1;
    }
    if (x.title.toLowerCase() > y.title.toLowerCase()) {
      return 1;
    }
    return 0;
  };

  const createSubreddit = async () => {
    const response = await post("/subreddit/create", subData);
    const newArray = [
      ...options,
      { title: response.data.subreddit.title, id: response.data.subreddit._id },
    ];
    const sortSubreddits = newArray.sort(sortArray);
    setOptions([...sortSubreddits]);
    setSubredditId(response.data.subreddit._id);
  };

  useEffect(() => {
    if (!user?.userId) navigate("/"); // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    setSubData({
      subData: {
        title,
        description,
        shortDescription,
      },
    });
  }, [title, description, shortDescription]);

  useEffect(() => {
    if (previousValues.current.subredditId !== subredditId) {
      navigate(`/subreddit/${subredditId}`);
    } // eslint-disable-next-line
  }, [subredditId]);

  return (
    <div
      className="createSubCard"
      style={{
        color: setTheme.postC,
        background: setTheme.postBg,
      }}
    >
      <h3>Create new subreddit</h3>
      <br />
      <Input
        className="createSubInput"
        type="text"
        value={title}
        placeholder="Title"
        onChange={(event) => setTitle(event.target.value)}
        sx={{
          color: setTheme.postC,
          border: `1px solid ${setTheme.postC}`,
          // borderColor: `${setTheme.postC} !important`,
        }}
      />
      <br />
      <Input
        className="createSubInput"
        type="text"
        value={shortDescription}
        placeholder="Short description"
        onChange={(event) => setShortDescription(event.target.value)}
        sx={{
          color: setTheme.postC,
          border: `1px solid ${setTheme.postC}`,
          // borderColor: `${setTheme.postC} !important`,
        }}
      />
      <br />
      <Input
        className="createSubInput"
        type="text"
        value={description}
        placeholder="Description"
        multiline
        rows={4}
        onChange={(event) => setDescription(event.target.value)}
        sx={{
          color: setTheme.postC,
          border: `1px solid ${setTheme.postC}`,
          // borderColor: `${setTheme.postC} !important`,
        }}
      />
      <br />
      <Button
        onClick={createSubreddit}
        disabled={!title || !shortDescription || !description ? true : false}
        sx={{
          "&:hover": {
            background: setTheme.buttonHover,
            color: setTheme.postC,
          },
          "&:disabled": {
            background: setTheme.disabledBg,
            color: setTheme.disabledC,
          },
        }}
      >
        Create new sub
      </Button>
    </div>
  );
};

export default CreateSubreddit;
