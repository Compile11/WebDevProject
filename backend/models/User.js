const mongoose = require("mongoose");
const crypto = require("crypto");

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

    // This is optional for now, but will allow us to add OAuth providers in the future if we want
    oauthAccounts: [
      {
        provider: {
          type: String,
          enum: ["google", "apple", "github", "microsoft"],
        },
        providerUserId: { type: String, required: true },
        accessToken: String,
        refreshToken: String,
      },
    ],

    sessions: [
      {
        tokenHash: { type: String, required: true },
        expiresAt: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true },
);

function generateDefaultUsername() {
  return "AnonymousUser_" + crypto.randomBytes(4).toString("hex");
}

module.exports = mongoose.model("User", userSchema)
