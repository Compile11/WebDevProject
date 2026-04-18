const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
      likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
