import { apiClient } from "./client";

export async function getAllPosts(page, limit) {
  try {
    const response = await apiClient.get(
      `/api/posts?page=${page}&limit=${limit}`,
    );

    return {
      data: response.data,
      error: null,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);

    return {
      data: null,
      error: "Could not fetch posts",
    };
  }
}

export async function getPostFeed(page = 1, limit = 10) {
  try {
    const response = await apiClient.get("/api/posts", {
      params: { page, limit },
    });

    return {
      data: response.data.posts,
      pagination: response.data.pagination,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      pagination: null,
      error: err.response?.data?.message || "Error fetching posts",
    };
  }
}

export async function getPostById(postId) {
  try {
    console.log("requesting postId:", postId)
    const response = await apiClient.get(`/api/posts/${postId}`);
    console.log("full response:", response)

    return {
      data: response.data,
      error: null,
    };
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

    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    console.error(`Error fetching posts for userId: ${userId}:`, err);

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
