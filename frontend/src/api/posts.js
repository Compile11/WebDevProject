import { apiClient } from "./client";

export async function getAllPosts() {
  try {
    const response = await apiClient.get("/api/posts");
    console.log(response.status);

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

export async function createNewPost(postData) {
  try {
    const response = await apiClient.post("/api/posts", postData)
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to create post" }
  }
}
