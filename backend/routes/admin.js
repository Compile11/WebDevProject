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

router.put("/users/:id/role", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const {role} = req.body;

        if (!['user', 'moderator', 'admin'].includes(role)) {
            return res.status(400).json({message: 'role not found'});
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {role},
            {new: true}
        ).select("-passwordHash");

        res.status(200).json(updatedUser);
    }catch(err){
        console.error("UPDATE ROLE ERROR: ", err);
        res.status(500).json({message: "Failed to update user role"});
    }
});

router.delete("/users/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(400).json({message: "You cannot delete your own admin account."});
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "User deleted successfully."});
    }catch(err){
        console.error("DELETE USER ERROR: ", err);
        res.status(500).send("ERROR: Failed to delete user");
    }
});

module.exports = router;