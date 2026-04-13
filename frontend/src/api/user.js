import { apiClient } from "./client";

export async function updateUser({ username, bio }) {
  const updates = {};

  if (username !== undefined) updates.username = username;
  if (bio !== undefined) updates.bio = bio;

  try {
    const response = await apiClient.put("/api/profile/update", updates);

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
