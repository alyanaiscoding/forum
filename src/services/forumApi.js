
const BASE_URL = "/api";

// HANDLE API RESPONSE
async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(
      `Server request failed (${response.status}).`
    );
  }

  const text = await response.text();

  if (!text.trim()) {
    throw new Error(
      "The API server returned an empty response. Please try again."
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "The API server returned invalid JSON."
    );
  }
}

// GET REQUEST
async function getRequest(endpoint, params = {}) {
  const query = new URLSearchParams(params);

  const response = await fetch(
    `${BASE_URL}/${endpoint}?${query}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  return handleResponse(response);
}

// POST REQUEST
async function postRequest(endpoint, data) {
  const response = await fetch(
    `${BASE_URL}/${endpoint}`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    }
  );

  return handleResponse(response);
}

// 1. GET POSTS
export function getPosts(page = 1) {
  return getRequest("forumGetPosts.php", {
    page,
  });
}

// 2. REGISTER USER
export function registerUser(username, password) {
  return postRequest("forumCreateUser.php", {
    username,
    password,
  });
}

// 3. LOGIN USER
export function loginUser(username, password) {
  return postRequest("forumLogin.php", {
    username,
    password,
  });
}

// 4. CREATE POST
export function createPost(userId, post) {
  return postRequest("forumNewPost.php", {
    id: userId,
    post,
  });
}

// 5. DELETE POST
export function deletePost(postId) {
  return getRequest("forumDeletePost.php", {
    id: postId,
  });
}

// 6. REPLY TO POST
export function replyPost(userId, postId, reply) {
  return postRequest("forumReplyPost.php", {
    user_id: userId,
    post_id: postId,
    reply,
  });
}

// 7. DELETE REPLY
export function deleteReply(replyId) {
  return getRequest("forumDeleteReply.php", {
    id: replyId,
  });
}
