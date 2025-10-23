const express = require("express");
const UserLog = require("../models/UserLog");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { _id, ipAddress, userAgent } = req.body;

    const user = await UserLog.findByIdAndUpdate(
      _id,
      { $addToSet: { ipAddress, userAgent } },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: "Data logged successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await UserLog.findById(userId);
    res.json({ exists: !!user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
