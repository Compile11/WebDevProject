import { BASE_URL } from "../baseUrl.js"

export async function getAllPosts() {
  try {
    const response = await fetch(`${BASE_URL}/api/posts`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    return {
      data,
      error: null
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { 
      data: null,
      error: "Could not fetch posts" 
    }
  }
}
