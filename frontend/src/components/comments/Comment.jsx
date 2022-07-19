import React, { useState } from "react";

import VoteBar from "./VoteBar";
import CommentRight from "./CommentRight";
import NewComment from "./NewComment";

const Comment = ({
  comment,
  actualComment,
  comments,
  setComments,
  setTheme,
  currentPost,
  setPostData,
}) => {
  const [writeNewComment, setWriteNewComment] = useState(false);

  return (
    <div>
      {actualComment && (
        <div
          className="nestedComment"
          style={{
            paddingBottom: "15px",
            borderBottom: `1px dotted ${setTheme.buttonBg}`,
          }}
        >
          <div className="commentSubCard">
            <VoteBar
              setTheme={setTheme}
              comment={comment}
              comments={comments}
              setComments={setComments}
            />
            <CommentRight
              setTheme={setTheme}
              comment={comment}
              comments={comments}
              setComments={setComments}
              writeNewComment={writeNewComment}
              setWriteNewComment={setWriteNewComment}
            />
          </div>
          {writeNewComment && (
            <NewComment
              setTheme={setTheme}
              comment={comment}
              comments={comments}
              setComments={setComments}
              setWriteNewComment={setWriteNewComment}
              currentPost={currentPost}
              setPostData={setPostData}
            />
          )}
        </div>
      )}

      {comments.filter(
        (actualComment) => comment._id === actualComment.ids.parentId
      ) &&
        comments
          .filter((actualComment) => comment._id === actualComment.ids.parentId)
          .map((actualComment, key) => {
            return (
              <div
                key={key}
                style={{
                  marginLeft: "10px",
                  paddingLeft: "5px",
                  borderLeft: `1px solid ${setTheme.buttonBg}`,
                }}
              >
                <Comment
                  comment={actualComment}
                  actualComment={actualComment}
                  comments={comments}
                  setComments={setComments}
                  setTheme={setTheme}
                  key={key}
                  writeNewComment={writeNewComment}
                  setWriteNewComment={setWriteNewComment}
                  currentPost={currentPost}
                  setPostData={setPostData}
                />
              </div>
            );
          })}
    </div>
  );
};

export default Comment;
