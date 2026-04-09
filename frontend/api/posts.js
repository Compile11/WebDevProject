import { apiClient } from "./client"

export async function getAllPosts() {
  try {
    const response = await apiClient.get("/posts");
    console.log(response.status)

    return {
      data: response.data,
      error: null
    }
  } catch (error) {
    console.error("Error fetching posts:", error)

    return {
      data: null,
      error: "Could not fetch posts"
    }
  }
}

export async function createNewPost(data) {

}
