import React from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../providers/auth";

import SelectSubreddit from "./SelectSubreddit";

import "../styles/navbar.css";

import { Button, IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightRoundIcon from "@mui/icons-material/NightlightRound"; // eslint-disable-next-line
import { FcBiohazard } from "react-icons/fc";
import { GiReactor } from "react-icons/gi";

const Navbar = ({ options, setOptions, darkMode, setDarkMode, setTheme }) => {
  const navigate = useNavigate();
  const { auth, token, logout, user } = useAuth();

  const nav = (path) => {
    navigate(path);
  };

  return (
    <nav
      className="navbar"
      style={{
        backgroundColor: setTheme.navbar,
        color: setTheme.buttonC,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: "10",
        minHeight: "60px",
      }}
    >
      <div>
        <Tooltip title="Go to home page">
          <IconButton
            className="reacdit"
            onClick={() => nav("/")}
            size="small"
            sx={{
              fontWeight: "900",
              fontSize: "1.8rem",
              "&:hover": {
                color: setTheme.buttonHover,
              },
            }}
          >
            <GiReactor size={30} /> Reacdit
          </IconButton>
        </Tooltip>
        <Button
          className="navbarButton"
          onClick={() => nav("/")}
          variant="contained"
          size="small"
          sx={{
            backgroundColor: setTheme.buttonBg,
            color: setTheme.buttonC,
            marginLeft: "10px",
            "&:hover": {
              background: setTheme.buttonHover,
            },
          }}
        >
          Home
        </Button>
        {user?.userId && (
          <>
            <Button
              className="navbarButton profileButton"
              onClick={() => nav("/profile")}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: setTheme.buttonBg,
                color: setTheme.buttonC,
                marginLeft: "10px",
                "&:hover": {
                  background: setTheme.buttonHover,
                },
              }}
            >
              Profile
            </Button>
            <Button
              className="navbarButton"
              onClick={() => nav("/createSubreddit")}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: setTheme.buttonBg,
                color: setTheme.buttonC,
                marginLeft: "10px",
                "&:hover": {
                  background: setTheme.buttonHover,
                },
              }}
            >
              Create Sub
            </Button>
          </>
        )}
      </div>
      <div>
        <SelectSubreddit
          options={options}
          setOptions={setOptions}
          setTheme={setTheme}
        />
      </div>
      <div>
        {!token ? (
          <div style={{ paddingRight: "10px" }}>
            <Tooltip title={darkMode ? "Go light!" : "Go dark!"}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                variant="contained"
                size="small"
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    color: setTheme.buttonHover,
                  },
                }}
              >
                {darkMode ? <LightModeIcon /> : <NightlightRoundIcon />}
              </IconButton>
            </Tooltip>
            <Button
              className="loginButton"
              onClick={() => auth("google")}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: setTheme.buttonBg,
                color: setTheme.buttonC,
                marginLeft: "10px",
                "&:hover": {
                  background: setTheme.buttonHover,
                },
              }}
            >
              Login
            </Button>
          </div>
        ) : (
          <div style={{ paddingRight: "10px" }}>
            <Tooltip title={darkMode ? "Go light!" : "Go dark!"}>
              <IconButton
                onClick={() => setDarkMode(!darkMode)}
                variant="contained"
                size="small"
                sx={{
                  marginLeft: "10px",
                  "&:hover": {
                    color: setTheme.buttonHover,
                  },
                }}
              >
                {darkMode ? <LightModeIcon /> : <NightlightRoundIcon />}
              </IconButton>
            </Tooltip>
            <Button
              className="loginButton"
              onClick={logout}
              variant="contained"
              size="small"
              sx={{
                backgroundColor: setTheme.buttonBg,
                color: setTheme.buttonC,
                marginLeft: "10px",
                "&:hover": {
                  background: setTheme.buttonHover,
                },
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
