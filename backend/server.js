const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const commentRoutes = require("./routes/comment");

require("dotenv").config();

const Post = require("./models/Post");
const authRoutes = require("./routes/auth"); // <-- Fixed typo!
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use("/api/users", authRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/profile", require("./routes/users"));
app.use("/api/comments", commentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.get("/api/posts", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();

    const posts = await Post.find()
      .populate("userId", "username email profilePic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        totalPosts,
        hasNextPage: page * limit < totalPosts,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "CANNOT FETCH POSTS", err });
  }
});

app.get("/api/users/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const posts = await Post.find({ userId })
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "CANNOT FETCH POSTS", err });
  }
});

app.get("/api/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "userId",
      "username email profilePic",
    );


    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: "Cannot fetch post:", error: err.message });
  }
});

app.post("/api/posts", authMiddleware, async (req, res) => {
  try {
    const { title, body, tags } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }

    const newPost = new Post({
      title: title.trim(),
      body: body.trim(),
      tags: Array.isArray(tags) ? tags : [],
      userId: req.user.id,
    });

    const savedPost = await newPost.save();
    const populatedPost = await savedPost.populate("userId", "username email");

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("CREATE POST ERROR:", err);
    res.status(500).json({ message: "Cannot create post" });
  }
});

app.put("/api/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like" });
  }
});
app.put("/api/posts/:id/dislikes", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.user.id;

    if (post.dislikes.includes(userId)) {
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userId);
    } else {
      post.dislikes.push(userId);
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    }
    await post.save();
    res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Error toggling dislike" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
