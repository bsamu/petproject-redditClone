import { React, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Callback from "./pages/Callback";
import Register from "./pages/Register";
import Subreddit from "./pages/Subreddit";
import PostFullView from "./pages/PostFullView";
import CreateSubreddit from "./pages/CreateSubreddit";

import Navbar from "./components/Navbar";
import Protected from "./components/Protected";

const App = () => {
  const [options, setOptions] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const lightTheme = {
    appBg: "#FFF5E6",
    buttonBg: "#467292",
    buttonC: "#E6FFEE",
    navbar: "#ADCADE",
    postBg: "#ADCADE",
    postC: "#080249",
    commentBg: "#8095A4",
    commentC: "#080249",
    buttonHover: "#0067c0",
    disabledBg: "#292929",
    disabledC: "#616161",
    boxShadow: "#3A3296",
  };
  // const lightTheme = {
  //   appBg: "#ffebcd",
  //   buttonBg: "#467292",
  //   buttonC: "#ffebcd",
  //   navbar: "#80c0ce",
  //   postBg: "#9adea2",
  //   postC: "#092d01",
  //   commentBg: "#c2f69b",
  //   commentC: "#080249",
  //   buttonHover: "#0067c0",
  //   disabledBg: "#292929",
  //   disabledC: "#616161",
  // };

  const darkTheme = {
    appBg: "#292929",
    buttonBg: "#1f1f1f",
    buttonC: "#dadada",
    navbar: "#616161",
    postBg: "#5E5555",
    postC: "#dadada",
    commentBg: "#5E5E5E",
    commentC: "#dadada",
    buttonHover: "#620bee",
    disabledBg: "#292929",
    disabledC: "#616161",
    boxShadow: "#dadada",
  };

  return (
    <div
      className="App"
      style={{ background: darkMode ? darkTheme.appBg : lightTheme.appBg }}
    >
      <Navbar
        options={options}
        setOptions={setOptions}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setTheme={darkMode ? darkTheme : lightTheme}
      />
      <Routes>
        <Route
          path="/"
          element={<Home setTheme={darkMode ? darkTheme : lightTheme} />}
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <Profile setTheme={darkMode ? darkTheme : lightTheme} />
            </Protected>
          }
        />
        <Route
          path="/createSubreddit"
          element={
            <Protected>
              <CreateSubreddit
                options={options}
                setOptions={setOptions}
                setTheme={darkMode ? darkTheme : lightTheme}
              />{" "}
            </Protected>
          }
        />
        <Route
          path="/callback/:provider"
          element={<Callback setTheme={darkMode ? darkTheme : lightTheme} />}
        />
        <Route
          path="/subreddit/:subredditId"
          element={<Subreddit setTheme={darkMode ? darkTheme : lightTheme} />}
        />
        <Route
          path="/post/:postId"
          element={
            <PostFullView setTheme={darkMode ? darkTheme : lightTheme} />
          }
        />
        <Route
          path="/register"
          element={
            <Protected>
              <Register setTheme={darkMode ? darkTheme : lightTheme} />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
