const express = require("express");
const UserProfile = require("../models/UserProfile");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { _id, name, phone, email, dob, experience, skills } = req.body;

    const user = await UserProfile.findByIdAndUpdate(
      _id,
      { $set: { name, phone, email, dob, experience, skills } },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "Profile saved successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
