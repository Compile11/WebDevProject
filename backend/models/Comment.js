const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        text:{
            type: String,
            required: true,
            trim: true,
        },
        postId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        authorName:{
            type: String,
            required: true,
            default: 'Anonymous Student',
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Comment||mongoose.model("Comment", commentSchema);