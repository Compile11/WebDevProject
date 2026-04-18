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

router.put("/:commentId/like", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.id;

    if (comment.likes.includes(userId)) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter((id) => id.toString() !== userId);
    }

    await comment.save();
    res.status(200).json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Error toggling comment like" });
  }
});

router.put("/:commentId/dislike", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const userId = req.user.id;

    if (comment.dislikes.includes(userId)) {
      comment.dislikes = comment.dislikes.filter((id) => id.toString() !== userId);
    } else {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
    }

    await comment.save();
    res.status(200).json({ likes: comment.likes, dislikes: comment.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Error toggling comment dislike" });
  }
});

module.exports = router;
