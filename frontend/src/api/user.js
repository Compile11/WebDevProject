import { apiClient } from "./client";

export async function updateUserUsername(username) {
  try {
    const response = await apiClient.put("/api/profile/update-username", username);

    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: err.response?.data?.message || "Error updating profile",
    };
  }
}
