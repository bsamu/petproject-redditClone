import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { redditApi } from "../api/redditApi";

import "../styles/postFullView.css";

import PostPreview from "../components/PostPreview";
import CommentCaller from "../components/CommentCaller";
import LoadingMask from "../components/LoadingMask";

const PostFullView = ({ setTheme }) => {
  const { postId } = useParams();
  const { get } = redditApi();

  const [postData, setPostData] = useState("");
  const [comments, setComments] = useState("");
  const [createNewComment, setCreateNewComment] = useState(false);
  const [show, setShow] = useState(false);
  const postFullViewClass = "postFullViewClass";

  const getPost = async () => {
    const response = await get(`/post/${postId}`);
    setPostData(response.data.post);
    setComments(response.data.comments);
  };

  useEffect(() => {
    getPost(); // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [postData, comments]);

  return (
    <div
      className="postFullViewCard"
      style={{
        background: `linear-gradient(180deg, ${setTheme.postBg} 0%, ${setTheme.commentBg} 100%)`,
        boxShadow: `0px 0px 5px 1px ${setTheme.boxShadow}`,
      }}
    >
      {!postData && !comments && <LoadingMask setTheme={setTheme} />}
      {postData && (
        <PostPreview
          currentPost={postData}
          setPostData={setPostData}
          setTheme={setTheme}
          createNewComment={createNewComment}
          setCreateNewComment={setCreateNewComment}
          postFullViewClass={postFullViewClass}
          comments={comments}
          setComments={setComments}
        />
      )}
      {comments.length !== 0 && (
        <CommentCaller
          comments={comments}
          setComments={setComments}
          setTheme={setTheme}
          createNewComment={createNewComment}
          setCreateNewComment={setCreateNewComment}
          show={show}
          setShow={setShow}
          currentPost={postData}
          setPostData={setPostData}
        />
      )}
    </div>
  );
};

export default PostFullView;
