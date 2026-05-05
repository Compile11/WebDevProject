const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: "I am new member of Compile",
      maxLength: 200,
    },
    profilePic: {
      type: String,
      default: "",
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    lastActive: { type: Date, default: Date.now },
    subscriptionStatus: {
      type: String,
      enum: [
        "none",
        "active",
        "trialing",
        "canceling",
        "past_due",
        "canceled",
        "unpaid",
        "incomplete",
        "incomplete_expired",
        "paused",
      ],
      default: "none",
    },
    subscriptionTier: {
      type: String,
      enum: ["free", "tier1", "tier2"],
      default: "free",
    },
    subscriptionCancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    subscriptionCanceledAt: Date,
    subscriptionEndsAt: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    subscriptionCurrentPeriodEnd: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
