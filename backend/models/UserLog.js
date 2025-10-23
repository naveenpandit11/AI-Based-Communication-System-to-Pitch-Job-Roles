const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  _id: { type: String, require: true },
  ipAddress: { type: String, require: true },
  userAgent: { type: [String], default: [] },
});

module.exports = mongoose.model("UserLog", userSchema);
