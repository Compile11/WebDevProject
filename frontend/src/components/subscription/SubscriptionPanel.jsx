import { manageSubscription } from "../../api/manageSubscription";
import SubscriptionBadge from "./SubscriptionBadge";
import DeveloperButton from "./DeveloperButton";
import MaintainerButton from "./MaintainerButton";
import { CreditCard } from "lucide-react";

export default function SubscriptionPanel({
  currentUser,
  isLoading,
  setIsLoading,
  displayMessage,

  cardClass,
  cardHeaderClass,
  headingClass
}) {
  const tierDisplay = {
    free: "Free",
    tier1: "Developer",
    tier2: "Maintainer",
  };

  console.log(currentUser);

  const formatSubscriptionDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const isPaidStatus =
    currentUser.subscriptionStatus === "active" ||
    currentUser.subscriptionStatus === "trialing" ||
    currentUser.subscriptionStatus === "canceling";

  const nextPaymentDate = formatSubscriptionDate(
    currentUser.subscriptionCurrentPeriodEnd,
  );

  const subscriptionEndDate = formatSubscriptionDate(
    currentUser.subscriptionEndsAt || currentUser.subscriptionCurrentPeriodEnd,
  );

  const isSubscriptionEnding =
    currentUser.subscriptionStatus === "canceling" ||
    currentUser.subscriptionCancelAtPeriodEnd ||
    Boolean(
      isPaidStatus &&
      currentUser.subscriptionEndsAt &&
      currentUser.subscriptionCurrentPeriodEnd &&
      new Date(currentUser.subscriptionEndsAt).getTime() !==
      new Date(currentUser.subscriptionCurrentPeriodEnd).getTime(),
    );

  const currentPlanLabel = isPaidStatus
    ? tierDisplay[currentUser.subscriptionTier] || "Paid"
    : "Free";


  const handleManageSubscription = async (flow) => {
    setIsLoading(true);

    try {
      await manageSubscription(flow);
    } catch (err) {
      displayMessage("Could not open subscription manager.", true);
      setIsLoading(false);
    }
  };

  return (
    <div className={cardClass}>
      <div className={cardHeaderClass}>
        <CreditCard className="text-blue-600 dark:text-blue-400" size={20} />
        <h2 className={headingClass}>Subscription</h2>
      </div>

      <div className="p-6 space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          Current Plan:{" "}
          <span className="font-bold text-gray-600 dark:text-gray-200">{currentPlanLabel}</span>
          <SubscriptionBadge user={currentUser} />
        </div>

        {isPaidStatus && (nextPaymentDate || subscriptionEndDate) && (
          <div className="text-sm text-gray-400">
            {isSubscriptionEnding && subscriptionEndDate
              ? `Subscription will end on ${subscriptionEndDate}.`
              : nextPaymentDate
                ? `Next payment due ${nextPaymentDate}.`
                : null}
          </div>
        )}

        {!isPaidStatus ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DeveloperButton isLoading={isLoading} setIsLoading={setIsLoading} />

            <MaintainerButton isLoading={isLoading} setIsLoading={setIsLoading} />
          </div>
        ) : (
          <div className="flex flex-row space-x-2 items-center">
            <button
              onClick={() => handleManageSubscription()}
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded-md cursor-pointer hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              Manage Subscription
            </button>

            {!isSubscriptionEnding && (
              <button
                onClick={() => handleManageSubscription("cancel")}
                disabled={isLoading}
                className="bg-red-600/20 text-red-400 border border-red-600 p-2 rounded-md cursor-pointer hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
