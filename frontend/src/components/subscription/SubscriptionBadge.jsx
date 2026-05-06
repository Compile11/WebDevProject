export default function SubscriptionBadge({ user }) {
  const isActive =
    user?.subscriptionStatus === "active" ||
    user?.subscriptionStatus === "trialing" ||
    user?.subscriptionStatus === "canceling";
  const tier = user?.subscriptionTier;

  if (!isActive || tier === "free") return null;

  const base = "inline-flex h-5 w-5 items-center justify-center rounded-full";

  const styles = {
    tier1: "bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md",
    tier2: "bg-gradient-to-br from-yellow-300 to-yellow-500 text-black shadow-[0_0_8px_rgba(250,204,21,0.8)]",
  };

  return (
    <div
      title={tier === "tier2" ? "Maintainer Subscriber" : "Developer Subscriber"}
      className={`${base} ${styles[tier]}`}
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3">
        <path
          fill="currentColor"
          d="M8 6 3 12l5 6 1.5-1.5L6 12l3.5-4.5L8 6zm8 0-1.5 1.5L18 12l-3.5 4.5L16 18l5-6-5-6z"
        />
      </svg>
    </div>
  );
}
