import { apiClient } from "./client";

export async function getAllPosts(page, limit) {
  try {
    const response = await apiClient.get(`/api/posts?page=${page}&limit=${limit}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { data: null, error: "Could not fetch posts" };
  }
}

// THIS IS THE FUNCTION UPDATED FOR FLAIRS
export async function getPostFeed(page = 1, limit = 10, flair = null) {
  try {
    const params = { page, limit };
    if (flair) params.flair = flair;

    const response = await apiClient.get("/api/posts", { params });

    return {
      data: response.data.posts,
      pagination: response.data.pagination,
      error: null,
    };
  } catch (err) {
    // 1. added this log so we can see the exact JS error if it fails!
    console.error("DEBUG FETCH ERROR:", err);

    return {
      data: null,
      pagination: null,
      error: err.response?.data?.message || "Error fetching posts",
    };
  }
}

export async function getPostById(postId) {
  try {
    const response = await apiClient.get(`/api/posts/${postId}`);
    return { data: response.data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.message || "Error fetching post",
    };
  }
}

export async function getPostsByUserId(userId) {
  try {
    const response = await apiClient.get(`/api/users/${userId}/posts`);
    return { data: response.data, error: null };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.message || "Error fetching posts",
    };
  }
}

export async function createNewPost(postData) {
  try {
    const response = await apiClient.post("/api/posts", postData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create post" };
  }
}