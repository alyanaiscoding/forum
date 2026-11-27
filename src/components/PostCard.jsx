
import { useState } from "react";
import Reply from "./Reply";

function PostCard({
  post,
  user,
  onDelete,
  onReply,
  onDeleteReply,
}) {
  const [replyText, setReplyText] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = String(post.uid) === String(user.id);

  const replies = Array.isArray(post.reply)
    ? post.reply
    : [];

  async function handleSubmitReply(e) {
    e.preventDefault();

    if (!replyText.trim() || submitting) return;

    setSubmitting(true);

    try {
      const success = await onReply(
        post.id,
        replyText.trim()
      );

      if (success) {
        setReplyText("");
        setShowReplies(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="post-card">
      <div className="post-header">
        <div>
          <h3>{post.user}</h3>
          <small>{post.date}</small>
        </div>

        {isOwner && (
          <button
            className="delete-btn"
            onClick={() => onDelete(post.id)}
          >
            Delete
          </button>
        )}
      </div>

      <p className="post-text">{post.post}</p>

      <button
        className="reply-toggle"
        onClick={() => setShowReplies(!showReplies)}
      >
        {showReplies ? "Hide" : "View"} Replies
        ({replies.length})
      </button>

      {showReplies && (
        <div className="replies-section">
          {replies.length === 0 && (
            <p>No replies yet.</p>
          )}

          {replies.map((reply) => (
            <Reply
              key={reply.id}
              reply={reply}
              user={user}
              onDeleteReply={onDeleteReply}
            />
          ))}

          <form
            className="reply-form"
            onSubmit={handleSubmitReply}
          >
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText}
              onChange={(e) =>
                setReplyText(e.target.value)
              }
              required
            />

            <button
              type="submit"
              disabled={submitting || !replyText.trim()}
            >
              {submitting ? "Sending..." : "Reply"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default PostCard;
