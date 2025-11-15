import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EmailList() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);

  const handleAddEmail= async (jobTitle)=>{
    
    setLoading(true);
    try{
      const emailRes=await fetch("http://localhost:7001/api/emails/generate-email",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify({
          _id:userId,
          jobTitle:jobTitle,
        }),
      });
      const emailResponse = await emailRes.json();

    if (emailResponse.success) {
      alert("✅ Email generated successfully!");
      navigate(`/emails/${userId}`);
       
    } else {
      alert("⚠️ Failed to generate email.");
      console.error(emailResponse.message || "Unknown error");
    }
    }catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error while connecting to backend");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const res = await fetch(`http://localhost:7001/api/emails/${userId}`);
        const data = await res.json();

        if (data.success) {
          setJobs(data.emails[0]?.jobs || []);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching emails:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [userId]);

  const toggleExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600">Loading job details...</p>
    );

  if (!jobs.length)
    return (
      <div>
        <nav className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-semibold">Email Dashboard</h1>
          <button
            onClick={() => navigate(`/job/${userId}`)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            ➕ Add Job
          </button>
        </nav>
      <p className="text-center mt-10 text-gray-500">
        No jobs or emails found for this user yet.
      </p>
      </div>
    );

  return (
    <div>
      <nav className="bg-gray-800 text-white py-3 px-6 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-semibold">Email Dashboard</h1>
          <button
            onClick={() => navigate(`/job/${userId}`)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
             Add Job
          </button>
        </nav>
    <div className="max-w-4xl mx-auto mt-10 p-6">
      
      
      <h2 className="text-2xl font-semibold mb-6 text-center">Job Emails Overview</h2>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.jobTitle}
            className="border border-gray-300 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Job Header */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(job.jobTitle)}
            >
              <h3 className="text-lg font-medium text-gray-800">
                {job.jobTitle}
              </h3>
              <span className="text-sm text-gray-500">
                {expandedJob === job.jobTitle ? "▲ Hide Emails" : "▼ Show Emails"}
              </span>
            </div>

            {/* Emails Section */}
            {expandedJob === job.jobTitle && (
              <div className="mt-4 border-t pt-4 space-y-3">
                {job.generatedEmails && job.generatedEmails.length > 0 ? (
                  job.generatedEmails.map((email, i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-lg bg-gray-50 shadow-sm"
                    >
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Email #{i + 1}</span>
                        <span>{new Date(job.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-800 whitespace-pre-wrap">
                        {email}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No emails generated for this job yet.
                  </p>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={()=>handleAddEmail(job.jobTitle)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Email
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
