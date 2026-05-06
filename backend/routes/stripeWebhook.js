require("dotenv").config();
const Stripe = require("stripe");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function toDate(timestamp) {
  return timestamp ? new Date(timestamp * 1000) : null;
}

function getPeriodEnd(subscription) {
  return (
    subscription.current_period_end ||
    subscription.items?.data?.[0]?.current_period_end ||
    subscription.cancel_at ||
    null
  );
}

function getTier(subscription, fallbackTier) {
  const priceId = subscription.items?.data?.[0]?.price?.id;

  const tierByPriceId = {
    [process.env.STRIPE_TIER1_PRICE_ID]: "tier1",
    [process.env.STRIPE_TIER2_PRICE_ID]: "tier2",
  };

  return tierByPriceId[priceId] || fallbackTier || subscription.metadata?.tier;
}
function buildActiveUpdate(subscription, tier, customerId) {
  const periodEnd = getPeriodEnd(subscription);
  const isActive = ACTIVE_STATUSES.has(subscription.status);
  const isCanceling =
    isActive &&
    subscription.cancel_at &&
    subscription.cancel_at > Math.floor(Date.now() / 1000);

  const endsAt = subscription.cancel_at || periodEnd;

  return {
    subscriptionStatus: isCanceling ? "canceling" : subscription.status,
    subscriptionTier: isActive ? tier : "free",

    stripeCustomerId: customerId || subscription.customer,
    stripeSubscriptionId: subscription.id,

    subscriptionCancelAtPeriodEnd:
      subscription.cancel_at_period_end || Boolean(subscription.cancel_at),

    subscriptionCurrentPeriodEnd: toDate(periodEnd),
    subscriptionEndsAt: toDate(endsAt),
    subscriptionCanceledAt: toDate(subscription.canceled_at),
  };
}

function buildCanceledUpdate(subscription) {
  const periodEnd = getPeriodEnd(subscription);
  const endedAt = subscription.ended_at || subscription.canceled_at || periodEnd;

  return {
    subscriptionStatus: "canceled",
    subscriptionTier: "free",

    subscriptionCancelAtPeriodEnd: false,
    subscriptionCanceledAt: toDate(subscription.canceled_at) || new Date(),
    subscriptionEndsAt: toDate(endedAt) || new Date(),
    subscriptionCurrentPeriodEnd: toDate(periodEnd),

    stripeSubscriptionId: null,
  };
}

async function updateUserFromSubscription(subscription, options = {}) {
  const userId = options.userId || subscription.metadata?.userId;
  const tier = getTier(subscription, options.tier);

  if (!userId || !tier) return;

  const update = buildActiveUpdate(subscription, tier, options.customerId);

  await User.findByIdAndUpdate(userId, update, { new: true });
}

async function handleCheckoutCompleted(session) {
  if (!session.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(session.subscription);

  await updateUserFromSubscription(subscription, {
    userId: session.metadata?.userId,
    tier: session.metadata?.tier,
    customerId: session.customer,
  });
}

async function handleSubscriptionDeleted(subscription) {
  await User.findOneAndUpdate(
    { stripeSubscriptionId: subscription.id },
    buildCanceledUpdate(subscription),
    { new: true },
  );
}

const handlers = {
  "checkout.session.completed": handleCheckoutCompleted,

  "customer.subscription.created": updateUserFromSubscription,
  "customer.subscription.updated": updateUserFromSubscription,

  "customer.subscription.deleted": handleSubscriptionDeleted,
};

module.exports = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const handler = handlers[event.type];

    if (handler) {
      await handler(event.data.object);
    }

    return res.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ message: "Webhook handler failed" });
  }
};
