const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router({mergeParams: true});

router.get("/", async (req, res) => {
    try{
        const comments = await Comment.find({postId: req.params.postId}).sort({createdAt:1});
        res.status(200).json(comments);
    }catch(err){
        console.error("Fetch Comments Error: ", err);
        res.status(500).json({message:"Server error fetching comments"});
    }
});

router.post("/", async (req, res) => {
    try{
        const{text, authorName} = req.body;
        const newComment = new Comment({
            text,
            postId: req.params.postId,
            authorName: authorName || "Anonymous Student"
        });
        const savedComment = await newComment.save();
        res.status(201).json(savedComment);
    }catch(err){
        console.error("Create Comments Error: ", err);
        res.status(500).json({message:"Server error creating comment"});
    }
});

module.exports = router;