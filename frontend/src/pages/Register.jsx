import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../providers/auth";

import "../styles/register.css";

import { Box, Button, Input } from "@mui/material";

const Register = ({ setTheme }) => {
  const [username, setUsername] = useState("");
  const [introduction, setIntroduction] = useState("");
  const navigate = useNavigate();
  const { user, register } = useAuth();

  useEffect(() => {
    if (user.userId) navigate("/profile"); // eslint-disable-next-line
  }, [user]);

  return (
    <div
      className="register"
      style={{
        color: setTheme.postC,
        background: setTheme.postBg,
      }}
    >
      Register
      <br />
      <Input
        type="text"
        value={username}
        placeholder="Username"
        onChange={(event) => setUsername(event.target.value)}
        sx={{ color: setTheme.commentC, background: setTheme.commentBg }}
      />
      <br />
      <Input
        type="text"
        value={introduction}
        placeholder="Introduction"
        onChange={(event) => setIntroduction(event.target.value)}
        sx={{ color: setTheme.commentC, background: setTheme.commentBg }}
      />
      <br />
      <Button
        sx={{
          color: setTheme.commentC,
          background: setTheme.commentBg,
          "&:hover": {
            background: setTheme.buttonHover,
          },
        }}
        onClick={() => register(username, introduction)}
      >
        Register
      </Button>
    </div>
  );
};

export default Register;
