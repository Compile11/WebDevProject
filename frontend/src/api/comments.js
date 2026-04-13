import { apiClient } from "./client";

export async function getComments(postId) {
  try {
    const response = await apiClient.get(`/api/posts/${postId}/comments`);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch comments" };
  }
}

export async function createComment({ postId, text }) {
  try {
    const response = await apiClient.post(`/api/posts/${postId}/comments`, {
      text,
    });

    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to create comment" };
  }
}
