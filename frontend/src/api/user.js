import { apiClient } from "./client";

export async function updateUser({ username, bio, profilePic }) {
  try {
    const formData = new FormData();

    if (username !== undefined) formData.append("username", username);
    if (bio !== undefined) formData.append("bio", bio);
    if (profilePic) formData.append("profilePic", profilePic);

    const response = await apiClient.put("/api/profile/update", formData);

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

export async function getUserProfile(userId){
  try{
    const response = await apiClient.get(`/api/profile/${userId}`);
    return {
      data: response.data,
      error: null,
    };
  }catch(err){
    return {
      data: null,
      error: err.response?.data?.message || "Error getting profile",
    };
  }
}

export async function getOnlineStaff(){
  try{
    const response = await apiClient.get(`/api/profile/staff/online`);
    return {data:response.data, error: null};
  }catch(err){
    return {data: null, error: "Error fetching staff"};
  }
}