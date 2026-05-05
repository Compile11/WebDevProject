require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", authMiddleware, async (req, res) => {
  const { tier } = req.body;

  const priceId =
    tier === "tier2"
      ? process.env.STRIPE_TIER2_PRICE_ID
      : process.env.STRIPE_TIER1_PRICE_ID;

  const user = await User.findById(req.user.id);
  const sessionConfig = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.CLIENT_URL}/settings?subscription=success`,
    cancel_url: `${process.env.CLIENT_URL}/settings?subscription=canceled`,

    metadata: {
      userId: user._id.toString(),
      tier,
    },

    subscription_data: {
      metadata: {
        userId: user._id.toString(),
        tier,
      },
    },
  };

  if (user.stripeCustomerId) {
    try {
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);

      if (customer && !customer.deleted) {
        sessionConfig.customer = user.stripeCustomerId;
      } else {
        await User.findByIdAndUpdate(user._id, { stripeCustomerId: null });
        sessionConfig.customer_email = user.email;
      }
    } catch (err) {
      if (err.code !== "resource_missing") {
        throw err;
      }

      await User.findByIdAndUpdate(user._id, { stripeCustomerId: null });
      sessionConfig.customer_email = user.email;
    }
  } else {
    sessionConfig.customer_email = user.email;
  }

  const session = await stripe.checkout.sessions.create(sessionConfig);
  res.json({ url: session.url });
});

router.post("/create-portal-session", authMiddleware, async (req, res) => {
  try {
    const { flow } = req.body;
    const user = await User.findById(req.user.id);
    let customerId = user?.stripeCustomerId;

    if (!customerId && user?.stripeSubscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );

      customerId = subscription.customer;

      if (customerId) {
        await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
      }
    }

    if (!customerId) {
      return res.status(400).json({
        message: "No Stripe customer found for this user"
      });
    }

    const sessionConfig = {
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/settings`,
    };

    if (flow === "cancel" && user?.stripeSubscriptionId) {
      sessionConfig.flow_data = {
        type: "subscription_cancel",
        subscription_cancel: {
          subscription: user.stripeSubscriptionId,
        },
        after_completion: {
          type: "redirect",
          redirect: {
            return_url: `${process.env.CLIENT_URL}/settings?subscription=canceled`,
          },
        },
      };
    }

    const session = await stripe.billingPortal.sessions.create(sessionConfig);

    res.json({ url: session.url });
  } catch (err) {
    console.error("Portal session error", err);
    res.status(400).json({ message: "Could not create portal session" });
  }
});

module.exports = router;
