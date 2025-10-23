const express = require("express");
const router = express.Router();
const groq = require("../groqClient");

const Emails = require("../models/Emails");
const UserProfile = require("../models/UserProfile");
const Job = require("../models/Job");

router.post("/generate-email", async (req, res) => {
  try {
    const { _id, jobTitle } = req.body;

    const profileData = await UserProfile.findById(_id);
    if (!profileData) {
      return res
        .status(404)
        .json({ success: false, message: "profile not found!" });
    }

    const jobData = await Job.findById(_id);
    if (!jobData || !jobData.jobs.length) {
      return res
        .status(404)
        .json({ success: false, message: "No job data found for this user!" });
    }

    const jobDetails = jobData.jobs.find((job) => job.jobTitle === jobTitle);
    if (!jobDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Job not found for this title!" });
    }

    const prompt_draftEmail = `

        Use the given user profile data and job description to create a concise, polite, and effective job application email.

        === PROFILE DATA ===
        ${JSON.stringify(profileData, null, 2)}

        === JOB DESCRIPTION ===
        ${JSON.stringify(jobDetails, null, 2)}

        === TASK ===
        Write a professional job application email to the recruiter. 
        The tone should be formal, confident, and clear.

        The email should:
        1. Begin with a polite greeting.
        2. Mention how the candidate found or is interested in the job.
        3. Highlight key skills, experience, or achievements from the profile relevant to the job.
        4. Express enthusiasm about contributing to the company.
        5. End with a courteous closing and contact information.

        Return only the email body, **without any explanations or markdown formatting**.
        `;

    const llmOutput_draftEmail = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "        You are an AI email writer that generates professional and personalized job application emails.",
        },
        { role: "user", content: prompt_draftEmail },
      ],
    });
    const emailDraft =
      llmOutput_draftEmail.choices[0]?.message?.content || "no respone";

    const prompt_relevance = `
            You will be given:
            1. A generated email.
            2. The applicant's profile data.
            3. The job description.

            Your task is to **analyze and score the relevance of the email** on a scale of **0 to 100**, where:
            - 0 = completely irrelevant,
            - 100 = perfectly aligned and personalized.

            Consider these factors:
            - Does the email mention relevant skills from the profile that match the job?
            - Is the tone professional and contextually appropriate?
            - Does it demonstrate understanding of the job role or company?
            - Is it free from hallucinations or unrelated content?

            Provide your answer in **JSON format only**, like this:

            {
            "score": 85,
            "feedback": "The email matches most of the job skills and maintains a professional tone, but lacks mention of experience with required frameworks."
            }

            === PROFILE DATA ===
            ${JSON.stringify(profileData, null, 2)}

            === JOB DESCRIPTION ===
            ${JSON.stringify(jobDetails, null, 2)}

            === GENERATED EMAIL ===
            ${emailDraft}
        `;

    const llmOutput_feedback = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are an evaluation assistant." },
        { role: "user", content: prompt_relevance },
      ],
    });
    const emailFeedback =
      llmOutput_feedback.choices[0]?.message?.content || "No relevance Output";

    const prompt_finalEmail = `
            You will receive:
            1. The applicant's profile data.
            2. The job description.
            3. The previously generated email.
            4. Its relevance score and feedback.

            Your task is to **rewrite or improve the email** to achieve a **higher relevance score** (closer to 100).  
            Make it more specific, relevant, and professional — while keeping it concise and natural.  
            Avoid generic phrases or repetition.

            Focus on:
            - Matching skills and experience from the profile with job requirements.
            - Using a tone that fits professional outreach (friendly yet formal).
            - Including genuine personalization details.
            - Fixing any issues mentioned in the feedback.

            Output the final improved email **only**, without any explanation or extra text.

            === PROFILE DATA ===
            ${JSON.stringify(profileData, null, 2)}

            === JOB DESCRIPTION ===
            ${JSON.stringify(jobDetails, null, 2)}

            === PREVIOUS EMAIL ===
            ${emailDraft}

            === RELEVANCE SCORE & FEEDBACK ===
            ${JSON.stringify(emailFeedback, null, 2)}
        `;
    const llmOutput_finalEmail = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an expert email writer specializing in professional communication and personalization.",
        },
        { role: "user", content: prompt_finalEmail },
      ],
    });
    const finalEmail =
      llmOutput_finalEmail.choices[0]?.message?.content || "No final email.";

    let emailRecord = await Emails.findById(_id);
    if (emailRecord) {
      const jobEntry = emailRecord.jobs.find((job) => job.jobTitle === jobTitle);

      if (jobEntry) {
        jobEntry.generatedEmails.push(finalEmail);
        jobEntry.emailCount = jobEntry.generatedEmails.length;
      } else {
        emailRecord.jobs.push({
          jobTitle,
          emailCount: 1,
          generatedEmails: [finalEmail],
        });
      }

      await emailRecord.save();
      return res.json({
        success: true,
        message: "Email saved successfully",
        emailRecord,
      });
    }

    const newEmailRecord = new Emails({
      _id,
      jobs: [
        {
          jobTitle,
          emailCount: 1,
          generatedEmails: [finalEmail],
        },
      ],
    });

    await newEmailRecord.save();

    res
      .status(201)
      .json({
        success: true,
        message: "new email record created successfully",
        emailRecord: newEmailRecord,
      });
  } catch (error) {
    console.error("Error saving email:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const emails = await Emails.find({ _id: userId });

    if (!emails.length) {
      return res.json({ success: true, emails: [] });
    }

    res.json({ success: true, emails });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching emails",
        error: err.message,
      });
  }
});

router.get("/:userId/:jobTitle", async (req, res) => {
  try {
    const { userId, jobTitle } = req.params;
    const emailRecord = await Emails.findById(userId);

    if (!emailRecord) {
      return res.json({ success: true, emails: [] });
    }

    const jobEntry = emailRecord.jobs.find((job) => job.jobTitle === jobTitle);
    if (!jobEntry) {
      return res.json({ success: true, emails: [] });
    }

    res.json({ success: true, emails: jobEntry.generatedEmails });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching job emails", error: err.message });
  }
});

module.exports = router;
