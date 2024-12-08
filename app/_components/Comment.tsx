"use client";

import React, { useEffect, useState } from "react";
import { createComment, getComments, deleteComment } from "@/app/actions";

interface CommentProps {
  pageId: number;
}

interface Comment {
  id: number;
  content: string;
  user: { username: string };
  createdAt: Date;
}

export default function Comment({ pageId }: CommentProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  // Fetch comments for the current page
  useEffect(() => {
    async function fetchComments() {
      if (!pageId) return;
      try {
        const res = await getComments(pageId);
        setComments(res);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    }
    fetchComments();
  }, [pageId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert("Please enter a comment.");
      return;
    }
    if (!pageId) {
      alert("No page selected.");
      return;
    }

    try {
      const res = await createComment(pageId, newComment);
      const comment = {
        ...res,
        user: { username: "You" },
      };
      setComments((prevComments) => [...prevComments, comment]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b pb-2 mb-2 flex justify-between items-start"
          >
            <div>
              <p className="text-sm text-gray-500">
                {comment.user.username} - {comment.createdAt.toLocaleString()}
              </p>
              <p className="text-gray-800">{comment.content}</p>
            </div>
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-red-500 text-sm hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <textarea
        className="border p-2 w-full mt-4"
        placeholder="Type your comment here..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button
        onClick={handleAddComment}
        className="mt-2 w-full bg-slate-700 text-white py-2 rounded hover:bg-slate-900"
      >
        Submit
      </button>
    </>
  );
}
