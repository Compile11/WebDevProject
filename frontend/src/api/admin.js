import { apiClient } from "./client";

export async function getAllUsers() {
    try {
        const response = await apiClient.get("/api/admin/users");
        return { data: response.data, error: null };
    } catch (err) {
        return { data: null, error: err.response?.data?.message || "Failed to fetch users" };
    }
}

//change a users role
export async function updateUserRole(userId, newRole){
    try{
        const response = await apiClient.put(`/api/admin/users/${userId}/role`, {role: newRole});
        return { data: response.data, error: null };
    }catch(err){
        return { data: null, error: err.response?.data?.message || "Failed to update role" };
    }
}

export async function deleteUser(userId){
    try{
        const response = await apiClient.delete(`/api/admin/users/${userId}`);
        return { data: response.data, error: null };
    }catch(err){
        return { data: null, error: err.response?.data?.message || "Failed to delete user" };
    }
}