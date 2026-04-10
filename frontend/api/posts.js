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
    const { data } = await apiClient.post("/api/posts", postData);

    return {
      data,
      error: null,
    };
  } catch (error) {
    console.error("Error creating post:", error);

    return {
      data: null,
      error: error.response?.data?.error || "Could not create post",
    };
  }
}
