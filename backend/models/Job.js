const mongoose = require("mongoose");

// Subdocument schema for individual job entries
const jobEntrySchema = new mongoose.Schema({
  jobId: { type: String, required: true }, // unique job identifier
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  location: { type: String, required: true },
  minExp: { type: Number, required: true },
  maxExp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const jobSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // user ID
    jobs: { type: [jobEntrySchema], default: [] }, // list of job roles
  },
  { versionKey: false }
);

module.exports = mongoose.model("Job", jobSchema);
