import { apiClient } from "./client";

// POST VOTES (These were already correct)
export const togglePostLike = (postId) => apiClient.put(`/api/posts/${postId}/like`);
export const togglePostDislike = (postId) => apiClient.put(`/api/posts/${postId}/dislike`);

// COMMENT VOTES (Updated to match the new /api/comments mount)
export const toggleCommentLike = (commentId) => apiClient.put(`/api/comments/${commentId}/like`);
export const toggleCommentDislike = (commentId) => apiClient.put(`/api/comments/${commentId}/dislike`);