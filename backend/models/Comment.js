const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
      likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
      dislikes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);
