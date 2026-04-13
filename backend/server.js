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

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB CONNECTION ERROR: ", err));

app.get("/", (_req, res) => {
  res.send("Backend is running");
});

app.get("/api/posts", async (_req, res) => {
  try {
    const posts = await Post.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "CANNOT FETCH POSTS", err });
  }
});

app.get("/api/posts/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const posts = await Post.find({ userId }).populate("userId", "username email").sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "CANNOT FETCH POSTS", err });
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

// (Deleted the rogue createNewUser line)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
