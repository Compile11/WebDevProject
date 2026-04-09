const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Post = require("./models/Post");
const app = express();

const { createNewUser } = require("./POST/user.js")

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log("DB CONNECTION ERROR: ", err));

app.get("/", (_req, res) => {
    res.send("Backend is running")
})


app.get("/api/posts", async (_req, res) => {
    try {
        const posts = await Post.find().sort({createdAt: -1});
        res.status(200).json(posts);
    }catch(err) {
        res.status(500).json({message : "CANNOT FETCH POSTS", err});
    }
})

app.post("/api/posts", async (req, res) => {
    try{
        const newPost = new Post(req.body);
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch(err) {
        console.error("FULL DB ERROR: ", err);
        res.status(500).json({message : "CANNOT FETCH POSTS", err});
    }
})

app.post("/api/user", createNewUser)


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
