const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

console.log("---> Profile routing file successfully loaded!");

//PUT ROUTE: Update users profile
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const updates = { ...req.body };

    const restrictedFields = ["password", "email", "passwordHash", "_id"];

    restrictedFields.forEach((field) => delete updates[field]);

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No value fields to update" });
    }

    if (updates?.username) {
      const usernameTaken = await User.exists({ username: updates.username });
      if (usernameTaken) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }

    //find user ID hidden inside their secure token
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true },
    );

    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("PROFILE UPDATE ERROR: ", err);
    res.status(500).json({ message: "SERVER ERROR UPDATING PROFILE" });
  }
});

router.put("/update-email", authMiddleware, async (req, res) => {
  // TODO
});

router.put("/update-password", authMiddleware, async (req, res) => {
  // TODO
});

module.exports = router;
