const mongoose = require("mongoose");

// Subdocument schema for individual job's emails
const jobEmailSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true }, // link to a job
  emailCount: { type: Number, required: true, default: 0 },
  generatedEmails: { type: [String], required: true, default: [] },
  createdAt: { type: Date, default: Date.now },
});

const emailSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // userId
    jobs: { type: [jobEmailSchema], default: [] }, // emails per job
  },
  { versionKey: false }
);

module.exports = mongoose.model("Emails", emailSchema);
