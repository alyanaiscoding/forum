function Reply({ reply, user, onDeleteReply }) {
  const isOwner = String(reply.uid) === String(user.id);

  return (
    <div className="reply-card">
      <div className="reply-header">
        <div>
          <strong>{reply.user}</strong>
          <small>{reply.date}</small>
        </div>

        {isOwner && (
          <button
            className="delete-btn"
            onClick={() => onDeleteReply(reply.id)}
          >
            Delete
          </button>
        )}
      </div>

      <p>{reply.reply}</p>
    </div>
  );
}

export default Reply;
