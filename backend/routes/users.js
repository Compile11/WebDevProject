const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

console.log("---> Profile routing file successfully loaded!");


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({message:"No Token Provided"});

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({message:"Invalid or Expired token"});
    }
};

//PUT ROUTE: Update users profile
router.put("/update", verifyToken, async (req, res) => {
    try{
        const {username, bio} = req.body;

        //find user ID hidden inside their secure token
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id||req.user.userId||req.user._id,
            {username:username, bio:bio},
            {returnDocument: "after"}
        );
        if(!updatedUser) return res.status(404).json({message:"User not found"});

        res.status(200).json(updatedUser);
    }catch(err){
        console.error("PROFILE UPDATE ERROR: ", err);
        res.status(500).json({message: "SERVER ERROR UPDATING PROFILE"});
    }
});

module.exports = router;