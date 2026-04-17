const express = require("express");
const Comment = require("../models/Comment");
const authMiddleware = require("../middleware/authMiddleware");
const {getToxicityScore} = require("../utils/moderator");

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      return res.status(400).json({ message: "postId is required" })
    }

    const comments = await Comment.find({ postId })
      .populate("userId", "username email")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (err) {
    console.error("Fetch Comments Error: ", err);
    res.status(500).json({ message: "Server error fetching comments" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params
    const { text } = req.body

    if (!postId) {
      return res.status(400).json({ message: "postId is required" })
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "text is required" })
    }
    //AI MODERATION GATEKEEPER
    const scores = await getToxicityScore(text);

    if(scores&&scores.toxicity > 0.8){
      return res.status(400).json({ message: "AI MODERATION: COMMENT FLAGGED FOR HIGH TOXICITY" })
    }

    const newComment = new Comment({
      text: text.trim(),
      postId,
      userId: req.user.id,
    });

    const savedComment = await newComment.save();
    const populatedComment = await savedComment.populate("userId", "username email")

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Create Comments Error: ", err);
    res.status(500).json({ message: "Server error creating comment" });
  }
});

module.exports = router;
