const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required" });
    }

    //checking if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already in use." });
    }

    //hashing password
    const passwordHash = await bcrypt.hash(password, 10);

    //create and save the new user
    const newUser = new User({
      username,
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUser._id,
        email: savedUser.email,
        username: savedUser.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (err) {
    console.error("REGISTRATION ERROR: ", err);
    res.status(500).json({ message: "Server Error during registration" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are requried" });
    }

    //finding the user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user?.bio,
        profilePic: user?.profilePic
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR: ", err);
    res.status(500).json({ message: "Server Error during login" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const {email} = req.body;
    //check if user exists

    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message: "No Account found with that email"});
    }
    //Generate a 64 character token
    const resetToken = crypto.randomBytes(32).toString("hex");

    //Save token and expiration date(1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000 //3.6M milliseconds = 1 hour
    await user.save();

    //configure nodemailer with .env credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    //construct specific URL so user will click on frontend
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    //Draft Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Compile - Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your Compile account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `${resetUrl}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged. This link will expire in 1 hour.`
    }
    //Send the email
    await transporter.sendMail(mailOptions);
    res.status(200).json({message: "Password reset sent to your email"});
  }catch(err){
    console.error("PASSWORD RESET ERROR: ", err);
    res.status(500).json({ message: "An error occurred while sending the email." });
  }
});

router.put("/reset-password/:token", async (req, res) => {
  try{
    const {token} = req.params;
    const {newPassword} = req.body;

    //find user with this exact token, IFF it hasnt expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: {$gt:Date.now()}
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.passwordHash = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({message: "Password has been successfully reset!"});
  }catch(err){
    console.error("PASSWORD RESET ERROR: ", err);
    res.status(500).json({ message: "An error occurred while resetting the password" });
  }
})

// GET ROUTE: Fetch full user profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // 1. Grab the full, fresh profile from the database
    const user = await User.findById(req.user.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Send the COMPLETE profile back to React
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic // React desperately needs this!
      }
    });
  } catch (err) {
    console.error("ME ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/verify/:token", async (req, res) => {
  try{
    const user = await User.findOne({verificationToken: req.params.token});

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email has been verified");
  }catch(err){
    res.status(500).send("Server error during verification");
  }
})

module.exports = router;
