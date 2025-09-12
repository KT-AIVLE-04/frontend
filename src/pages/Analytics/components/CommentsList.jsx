import React from "react";
import { CommentItem } from "./CommentItem";

export function CommentsList({ comments, userSet, currentPage, commentsPerPage }) {
  return (
    <div className="space-y-3">
      {comments.map((comment, index) => {
        // snsAuthorId가 있으면 Set에서의 인덱스 + 1을 사용자 번호로 사용
        const userNumber = comment.snsAuthorId 
          ? Array.from(userSet).indexOf(comment.snsAuthorId) + 1
          : (currentPage - 1) * commentsPerPage + index + 1;

        return (
          <CommentItem
            key={comment.commentId || index}
            comment={comment}
            userNumber={userNumber}
          />
        );
      })}
    </div>
  );
}
