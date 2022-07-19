import React from "react";

import CommentThread from "./comments/CommentThread";

const CommentCaller = ({
  comments,
  setComments,
  setTheme,
  currentPost,
  setPostData,
}) => {
  return (
    <div
      className="commentThread"
      style={{
        color: setTheme.commentC,
      }}
    >
      {!comments && <h5>There are no comments yet!</h5>}
      {comments && <h5>Comments:</h5>}
      {comments &&
        comments
          .filter((comment) => comment.ids.parentId === comment.ids.postId)
          .map((comment, key) => {
            return (
              <CommentThread
                comment={comment}
                comments={comments}
                setComments={setComments}
                setTheme={setTheme}
                key={key}
                currentPost={currentPost}
                setPostData={setPostData}
              />
            );
          })}
    </div>
  );
};

export default CommentCaller;
