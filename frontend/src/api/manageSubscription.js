import { apiClient } from "./client";

export async function manageSubscription(flow) {
  const res = await apiClient.post("/api/stripe/create-portal-session", {
    flow,
  });

  window.location.href = res.data.url;
}
