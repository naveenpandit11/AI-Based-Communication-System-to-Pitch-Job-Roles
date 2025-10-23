const express = require("express");
const Job = require("../models/Job");
const groq=require("../groqClient")
const router = express.Router();
const {v4:uuidv4}=require("uuid");

router.post("/create", async (req, res) => {
  try {
    const {_id, jobTitle, jd, location, minExp, maxExp } = req.body;

    if (!jobTitle || !jd || !location) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }
    const jobId=uuidv4;
    const prompt_JD=`
    You are an expert HR analyst and job-matching assistant.
    Extract all important structured information from the following Job Description and return it strictly in JSON format — no extra text or explanation.
    The JSON must include the following keys (use null if data not available):
    1.job_title
    2.company_name
    3.location
    4.employment_type (Full-time, Part-time, Contract, Internship, Remote, Hybrid, etc.)
    5.experience_required
    6.education_required
    7.skills_required (list of technical and soft skills)
    8.responsibilities (list of main duties)
    9.qualifications
    10.benefits
    11.salary_range
    12.posted_date
    13.application_deadline
    14.job_description_summary (2–3 line summary of the role)
    15.keywords (important terms related to the job)
  Output the result only as valid JSON (no markdown, no explanations, no comments).
  Job Description:${jd}
  `;
    const llmOutput_JD=await groq.chat.completions.create({
      model:"llama-3.1-8b-instant",
      messages:[{role:"system",content:prompt_JD}],
    });
    const jobDescription=llmOutput_JD.choices[0]?.message?.content||jobDescription ;   
    let userJobs = await Job.findById(_id);

    if (userJobs) {
      userJobs.jobs.push({
        jobId,
        jobTitle,
        jobDescription,
        location,
        minExp,
        maxExp,
      });
      await userJobs.save();
    } else {
      userJobs = new Job({
        _id,
        jobs: [
          {
            jobId,
            jobTitle,
            jobDescription,
            location,
            minExp,
            maxExp,
          },
        ],
      });
      await userJobs.save();
    }
    res.json({ success: true, job: userJobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/create/:userId",async(req,res)=>{
  try{
    const {id}=req.params;
    const jobDetails=await jobs.findById(id);
    if (!jobDetails) {
      return res.status(404).json({
        success: false,
        message: "job details not found!",
      });
    }
    res.json({success:true,job:jobDetails,});
  }catch(error){
    console.error("Error fetching job details",error);
    return res.status(500).json({
      success:false,
      message:"server error while fetching job details",
      error:error.message,
    });
  }
});

router.get("/:userId/:jobId", async (req, res) => {
  try {
    const { userId, jobId } = req.params;
    const userJobs = await Job.findById(userId);

    if (!userJobs) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const job = userJobs.jobs.find((j) => j.jobId === jobId);
    if (!job) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found" });
    }

    res.json({ success: true, job });
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching job details",
      error: err.message,
    });
  }
});

module.exports = router;

