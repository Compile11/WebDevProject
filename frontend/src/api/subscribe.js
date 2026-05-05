import { apiClient } from "./client"

export async function subscribe(tier) {
  const res = await apiClient.post(
    "/api/stripe/create-checkout-session",
    { tier }
  );

  window.location.href = res.data.url
}
