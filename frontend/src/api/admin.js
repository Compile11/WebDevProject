import { apiClient } from "./client";

export async function getAllUsers() {
    try {
        const response = await apiClient.get("/api/admin/users");
        return { data: response.data, error: null };
    } catch (err) {
        return { data: null, error: err.response?.data?.message || "Failed to fetch users" };
    }
}