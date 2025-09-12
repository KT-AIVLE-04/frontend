import React from "react";
import { formatDateTimeKorean } from "../../../utils";

export function CommentItem({ comment, userNumber }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-medium text-gray-900">
          사용자 {userNumber}
        </div>
        <div className="text-xs text-gray-500">
          {formatDateTimeKorean(comment.publishedAt)}
        </div>
      </div>

      <div className="text-sm text-gray-700 mb-2">{comment.text}</div>

      <div className="flex items-center text-xs text-gray-500">
        <span className="mr-3">👍 {comment.likeCount || 0}</span>
      </div>
    </div>
  );
}
