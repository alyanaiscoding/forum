
import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import PostCard from "../components/PostCard";

import {
  getPosts,
  createPost,
  deletePost,
  replyPost,
  deleteReply,
} from "../services/forumApi";

function Forum({ user, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, [page]);

  async function loadPosts() {
    setLoading(true);
    setError("");

    try {
      const data = await getPosts(page);

      if (!Array.isArray(data)) {
        throw new Error("Invalid posts response.");
      }

      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // CREATE POST
  async function handleCreatePost(e) {
    e.preventDefault();

    if (!newPost.trim() || posting) return;

    setPosting(true);
    setError("");

    try {
      const data = await createPost(
        user.id,
        newPost.trim()
      );

      if (data === true || data?.success === true) {
        setNewPost("");

        if (page === 1) {
          await loadPosts();
        } else {
          setPage(1);
        }
      } else {
        setError("Failed to create post.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  // DELETE POST
  async function handleDeletePost(postId) {
    const post = posts.find(
      (p) => String(p.id) === String(postId)
    );

    if (!post || String(post.uid) !== String(user.id)) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const data = await deletePost(postId);

      if (data === true || data?.success === true) {
        await loadPosts();
      } else {
        setError("Failed to delete post.");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // REPLY TO POST
  async function handleReply(postId, replyText) {
    if (!replyText.trim()) return false;

    setError("");

    try {
      const data = await replyPost(
        user.id,
        postId,
        replyText.trim()
      );

      if (data === true || data?.success === true) {
        await loadPosts();
        return true;
      }

      setError("Failed to submit reply.");
      return false;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }

  // DELETE REPLY
  async function handleDeleteReply(replyId) {
    const reply = posts
      .flatMap((post) =>
        Array.isArray(post.reply) ? post.reply : []
      )
      .find((r) => String(r.id) === String(replyId));

    if (!reply || String(reply.uid) !== String(user.id)) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this reply?"
    );

    if (!confirmed) return;

    setError("");

    try {
      const data = await deleteReply(replyId);

      if (data === true || data?.success === true) {
        await loadPosts();
      } else {
        setError("Failed to delete reply.");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="forum-container">
      <Navbar user={user} onLogout={onLogout} />

      <main className="forum-content">
        <h1>Community Forum</h1>
        <p>Connect and share your thoughts.</p>

        <form
          className="create-post"
          onSubmit={handleCreatePost}
        >
          <h3>Create a Post</h3>

          <textarea
            placeholder="What's on your mind?"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={4}
            required
          />

          <button
            type="submit"
            disabled={posting || !newPost.trim()}
          >
            {posting ? "Posting..." : "Publish Post"}
          </button>
        </form>

        {loading && <p>Loading posts...</p>}

        {error && (
          <div className="error">
            <p>{error}</p>
            <button onClick={loadPosts} disabled={loading}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p>No posts available.</p>
        )}

        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            user={user}
            onDelete={handleDeletePost}
            onReply={handleReply}
            onDeleteReply={handleDeleteReply}
          />
        ))}

        <div className="pagination">
          <button
            disabled={page === 1 || loading || posting}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>Page {page}</span>

          <button
            disabled={loading || posting || posts.length === 0}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default Forum;
