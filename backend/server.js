const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const commentRoutes = require("./routes/comment");

require("dotenv").config({
 path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});

const Post = require("./models/Post");
const authRoutes = require("./routes/auth"); // <-- Fixed typo!
const authMiddleware = require("./middleware/authMiddleware");
const {getToxicityScore} = require("./utils/moderator");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL, 
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

//gets
app.get("/api/posts", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const skip = (page - 1) * limit;
    const flair = req.query.flair;

    let query = {};
    if (flair&&flair!=="All Discussions"){
      query.flair = flair;
    }

    const totalPosts = await Post.countDocuments(query);

    const posts = await Post.find(query)
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

//posts

app.post("/api/posts", authMiddleware, async (req, res) => {
  try {
    const { title, body, tags, flair } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "title and body are required" });
    }
    // --- AI MODERATION GATEKEEPER ---
    const combineText = `${ title }. ${ body }`;
    const scores = await getToxicityScore(combineText);

    if(scores&&scores.toxicity>0.8){
      return res.status(400).json({message: "AI MODERATION: POST FLAGGED FOR HIGH TOXICITY"});
    }
    //__________________________________

    const newPost = new Post({
      title: title.trim(),
      body: body.trim(),
      tags: Array.isArray(tags) ? tags : [],
      flair: flair || "Q & A",
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


//puts
app.put("/api/posts/:id/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // 1. Force the userId to be a String right away to prevent comparison bugs
    const userIdStr = req.user.id.toString();

    // 2. Safely check if the user is in the array
    const hasLiked = post.likes.some((id) => id.toString() === userIdStr);

    if (hasLiked) {
      // UNLIKE: Remove the user
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
    } else {
      // LIKE: Add user and remove from dislikes
      post.likes.push(userIdStr);
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userIdStr);
    }

    await post.save();
    res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
  } catch (err) {
    res.status(500).json({ message: "Error toggling like" });
  }
});

// TOGGLE DISLIKE (Changed to singular "/dislike" and ".put" to match the frontend)
app.put("/api/posts/:id/dislike", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Force the userId to be a String
    const userIdStr = req.user.id.toString();

    // Safely check if the user is in the array
    const hasDisliked = post.dislikes.some((id) => id.toString() === userIdStr);

    if (hasDisliked) {
      // UNDISLIKE: Remove the user
      post.dislikes = post.dislikes.filter((id) => id.toString() !== userIdStr);
    } else {
      // DISLIKE: Add user and remove from likes
      post.dislikes.push(userIdStr);
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
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
