const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  _id: { type: String, require: true },
  name: { type: String, require: true },
  phone: { type: Number, require: true },
  email: { type: String, require: true },
  dob: { type: Date, require: true },
  experience: { type: Number, require: true },
  skills: { type: String, default: "" },
});

module.exports = mongoose.model("UserProfile", profileSchema);
