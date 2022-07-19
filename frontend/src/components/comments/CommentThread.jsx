import React, { useState } from "react";

import Comment from "./Comment";
import VoteBar from "./VoteBar";
import CommentRight from "./CommentRight";
import NewComment from "./NewComment";

const CommentThread = ({
  setTheme,
  comment,
  comments,
  setComments,
  currentPost,
  setPostData,
}) => {
  const [writeNewCommentRoot, setWriteNewCommentRoot] = useState(false);

  return (
    <div
      className="commentCard"
      sx={{
        paddingBottom: "15px",
        color: setTheme.commentC,
        background: setTheme.commentBg,
      }}
    >
      <div>
        <div
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
              writeNewCommentRoot={writeNewCommentRoot}
              setWriteNewCommentRoot={setWriteNewCommentRoot}
            />
          </div>
          {writeNewCommentRoot && (
            <NewComment
              setTheme={setTheme}
              comment={comment}
              comments={comments}
              setComments={setComments}
              setWriteNewComment={setWriteNewCommentRoot}
              setPostData={setPostData}
            />
          )}
        </div>
        <Comment
          comment={comment}
          comments={comments}
          setComments={setComments}
          setTheme={setTheme}
          currentPost={currentPost}
          setPostData={setPostData}
        />
      </div>
    </div>
  );
};

export default CommentThread;
