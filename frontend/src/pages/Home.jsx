import { React, useEffect, useState } from "react";

import { redditApi } from "../api/redditApi";

import "../styles/postView.css";

import PostPreview from "../components/PostPreview";
import LoadingMask from "../components/LoadingMask";

const Home = ({ setTheme }) => {
  const { get } = redditApi();

  const [posts, setPosts] = useState(null);
  const postPreviewClass = "postPreviewClass";

  const getPosts = async () => {
    const response = await get("/home");
    console.log(response.data);
    setPosts(response.data.posts);
  };

  useEffect(() => {
    getPosts(); // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [posts]);

  return (
    <div>
      {posts &&
        posts.map((currentPost, key) => (
          <PostPreview
            currentPost={currentPost}
            posts={posts}
            setPosts={setPosts}
            setTheme={setTheme}
            postPreviewClass={postPreviewClass}
            key={key}
          />
        ))}
      {!posts && posts !== [] && <LoadingMask setTheme={setTheme} />}
    </div>
  );
};

export default Home;
