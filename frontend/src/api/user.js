import { apiClient } from "./client";

export async function updateUser({ username, bio, profilePic }) {
  try {
    const formData = new FormData();

    if (username !== undefined) formData.append("username", username);
    if (bio !== undefined) formData.append("bio", bio);
    if (profilePic !== undefined) formData.append("profilePic", profilePic);

    const response = await apiClient.put("/api/profile/update", formData, {
      headers: {
        "Content-Type": "mutipart/form-data",
      },
    });

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
