# TODO: Fix Email Fetching and Job Data Retrieval

- [x] Fix backend/routes/emailRoutes.js: Change require("../models/emails") to require("../models/Emails") and Email.find to Emails.find in the GET /:userId route.
- [x] Update frontend/src/components/EmailList.jsx: Change setJobs(data.jobs || []) to setJobs(data.emails[0]?.jobs || []), replace job.jobId with job.jobTitle, update email mapping to use job.generatedEmails (array of strings) with job.createdAt, and update navigation buttons to use job.jobTitle.
- [x] Fix backend/routes/emailRoutes.js: Correct jobData fetching in POST /generate-email to find Job by _id then locate the specific job in jobs array by jobTitle, and use jobDetails in all prompts.
