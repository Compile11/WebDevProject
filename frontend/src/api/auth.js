import { apiClient } from "./client";

export async function registerUser({ username, email, password, turnstileToken }) {
  try {
    const response = await apiClient.post("/api/users/register", {
      username,
      email,
      password,
      turnstileToken,
    });

    return response.data
  } catch (err) { 
    throw err.response?.data || { message: "Registration failed" }
  }
}

export async function loginUser({ email, password, turnstileToken }) {
  try {
    const response = await apiClient.post("/api/users/login", {
      email,
      password,
      turnstileToken,
    });

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

export async function resetPasswordEmail(email) {
  try {
    const response = await apiClient.post("/api/users/reset-password", {
      email
    })

    return {
      data: response.data,
      error: null
    }
  } catch (err) {
    return {
      data: null,
      error: err.response?.data || { message: "Failed to send reset password email" }
    }
  }
}
