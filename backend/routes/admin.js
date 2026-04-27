const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    try{
        const users = await User.find()
            .select("-passwordHash -resetPasswordToken -resetPasswordExpires -verificationToken")
            .sort({ createdAt: -1 });

        res.status(200).json(users);
    }catch(err){
        console.error("FETCH ADMINS ERROR: ", err);
        res.status(500).send("ERROR: Failed to fetch users");
    }
});

module.exports = router;