import { apiClient } from "./client";

export async function registerUser({ username, email, password }) {
  try {
    const response = await apiClient.post("/api/users/register", {
      username,
      email,
      password,
    });

    return response.data
  } catch (err) { 
    throw err.response?.data || { message: "Registration failed" }
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await apiClient.post("/api/users/login", {
      email,
      password
    })

    return response.data
  } catch (err) {
    throw err.response?.data || { message: "Login failed" }
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.get("/api/users/me");
    return response.data
  } catch (err) {
    throw err.response?.data || { message: "Failed to fetch current user" }
  }
}
