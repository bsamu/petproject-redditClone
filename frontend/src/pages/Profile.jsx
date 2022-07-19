import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../providers/auth";
import { redditApi } from "../api/redditApi";

import "../styles/profile.css";

import { Button, Input } from "@mui/material";

const Profile = ({ setTheme }) => {
  const { user, token } = useAuth();
  const { patch, get } = redditApi();
  const navigate = useNavigate();

  const [subData, setSubData] = useState({});
  const [introduction, setIntroduction] = useState("");
  const [userInfo, setUserInfo] = useState("");

  const getUserData = async () => {
    const response = await get("/user/getUser");
    setUserInfo(response.data);
  };

  useEffect(() => {
    if (!user?.userId) navigate("/"); // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    setSubData({
      updateInfo: {
        introduction,
      },
    });
  }, [introduction]);

  useEffect(() => {
    getUserData(); // eslint-disable-next-line
  }, []);

  return (
    <div
      className="profileCard"
      style={{
        color: setTheme.postC,
        background: setTheme.postBg,
      }}
    >
      {token && userInfo && (
        <p className="greet">Hello {userInfo.user.username}!</p>
      )}
      <h3>Introduction</h3>
      {userInfo && <p className="introduction">{userInfo.user.introduction}</p>}
      <br />
      <Input
        className="introInput"
        type="text"
        value={introduction}
        placeholder="Introduction"
        multiline
        rows={4}
        onChange={(event) => setIntroduction(event.target.value)}
        sx={{
          color: setTheme.postC,
          border: `1px solid ${setTheme.postC}`,
          // borderColor: `${setTheme.postC} !important`,
        }}
      />
      <br />
      <Button
        disabled={!introduction ? true : false}
        onClick={async () => {
          const response = await patch("/user/edit", subData);
          setUserInfo({
            user: {
              username: userInfo.user.username,
              introduction: response.data.user.introduction,
            },
          });
        }}
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
        Update userinfo
      </Button>
    </div>
  );
};

export default Profile;
