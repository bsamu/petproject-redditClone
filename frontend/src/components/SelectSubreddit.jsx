import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { redditApi } from "../api/redditApi";

import { Box, InputLabel, MenuItem, FormControl, Select } from "@mui/material/";

const SelectSubreddit = ({ options, setOptions, setTheme }) => {
  const { get } = redditApi();
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleChange = async (event) => {
    navigate(`/subreddit/${event.target.value}`);
    setValue("");
  };

  const sortArray = (x, y) => {
    if (x.title.toLowerCase() < y.title.toLowerCase()) {
      return -1;
    }
    if (x.title.toLowerCase() > y.title.toLowerCase()) {
      return 1;
    }
    return 0;
  };

  const getSubreddits = async () => {
    const response = await get("/subreddit/getAll");
    const sortSubreddits = response.data.subreddits.sort(sortArray);
    const mapSubreddits = sortSubreddits.map((subreddit) => ({
      title: subreddit.title,
      id: subreddit._id,
    }));
    setOptions([...mapSubreddits]);
  };

  useEffect(() => {
    getSubreddits(); // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [options]);

  return (
    <>
      {options ? (
        <Box
          sx={{
            minWidth: 120,
          }}
        >
          <FormControl
            size="small"
            sx={{
              width: "130px",
              backgroundColor: setTheme.navbar,
              color: setTheme.buttonC,
            }}
          >
            <InputLabel>Select a sub</InputLabel>
            <Select
              value={value}
              label="Select a subreddit"
              onClose={() => {
                setTimeout(() => {
                  document.activeElement.blur();
                }, 0);
              }}
              onChange={handleChange}
            >
              {options.map((option, key) => (
                <MenuItem value={option.id} key={key}>
                  {option.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default SelectSubreddit;
