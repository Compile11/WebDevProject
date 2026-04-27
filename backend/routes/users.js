const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const bcrypt = require("bcryptjs");

router.get("/staff/online", async (req, res) => {
  try{
    const fifteenMinsAgo = new Date(Date.now() - 15+60+1000);

    const staff = await User.find({
      role: {$in: ['admin', 'moderator']},
      lastActive: {$gte: fifteenMinsAgo}
    }).select("username profilePic role");

  }catch(err){
    console.error("STAFF FETCH ERROR: ",err);
    res.status(500).json({message: "Failed to fetch Staff"});
  }
});

router.get("/:id", async (req, res) => {
  try{
    const user = await User.findById(req.params.id).select("-passwordHash -resetPasswordToken -resetPasswordExpires");

    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json(user);
  }catch(err){
    console.error("PUBLIC PROFILE ERROR: ", err);
    res.status(500).json({message: "Internal Server Error Fetching Profile"});
  }
});


//PUT ROUTE: Update users profile
router.put("/update", authMiddleware, upload.single("profilePic"), async (req, res) => {
  try {
    // 1. Gather text fields from Multer's req.body
    const updates = {};

    if (req.body.username !== undefined) {
      updates.username = req.body.username;
    }

    if (req.body.bio != undefined) {
      updates.bio = req.body.bio
    }

    // 2. Add the image path if a file was uploaded
    if (req.file) {
      updates.profilePic = req.file.path;
    }

    // 3. Username Conflict Check (Ignore yourself)
    if (updates.username) {
      // Check if the username is taken by ANYONE ELSE
      const usernameTaken = await User.findOne({
        username: updates.username,
        _id: { $ne: req.user.id } // This ignores your own record
      });

      if (usernameTaken) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    // 4. Update Database
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { returnDocument: 'after' }
    ).select("-passwordHash");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // 5. Return the clean object
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Server error during update" });
  }
});

//UPDATE EMAIL
router.put("/update-email", authMiddleware, async (req, res) => {
  try{
    const {newEmail, currentPassword} = req.body;

    const user = await User.findById(req.params.id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if(!isMatch) return res.status(404).json({ message: "INCORRECT PASSWORD. CANNOT UPDATE EMAIL" });

    const emailTaken = await User.findOne({email: newEmail});
    if(emailTaken && emailTaken._id.toString()!==req.user.id){
      return res.status(400).json({ message: "Email already taken" });
    }

    user.email = newEmail;
    await user.save();

  }catch(err){
    console.error("EMAIL UPDATE ERROR: ", err);
    res.status(500).json({message: "Server error updating email"});
  }
});

//UPDATE PASSWORD
router.put("/update-password", authMiddleware, async (req, res) => {
  try{
    const {currentPassword, newPassword} = req.body;
    const user = await User.findById(req.params.id);
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if(!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({message: "Password updated successfully"});
  }catch(err){
    console.error("PASSWORD UPDATE ERROR: ", err);
    res.status(500).json({message: "Server error during update password"});
  }
});

//DELETE ACCOUNT
router.delete("/delete-account", authMiddleware, async (req, res) => {
  try{
    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({message: "User deleted successfully"});
  }catch(err){
    console.error("DELETE ACCOUNT ERROR: ", err);
    res.status(500).json({message: "Server error during delete account"});
  }
});

module.exports = router;
