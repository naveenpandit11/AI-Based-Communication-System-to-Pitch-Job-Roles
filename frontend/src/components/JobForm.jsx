import { useState } from "react";
import { useNavigate,useParams } from "react-router-dom";

export default function JobForm() {
  const navigate=useNavigate();
  const {userId}=useParams();
  const [jobTitle, setJobTitle] = useState("");
  const [jd, setJd] = useState("");
  const [location, setLocation] = useState("");
  const [minExp, setMinExp] = useState("");
  const [maxExp, setMaxExp] = useState("");
  const [numberOfEmails, setNumberOfEmails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const jobData = {
      jobTitle,
      jd,
      location,
      minExp,
      maxExp,
      //numberOfEmails: Number(numberOfEmails),
    };

    try {
      const jobRes = await fetch("http://localhost:7001/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id:userId,
          ...jobData,
        }),
      });

      const jobResponse = await jobRes.json();

      if (!jobResponse.success) {
        alert("❌ Failed to create job: " + jobResponse.message);
        setLoading(false);
        return;
      }
      alert("job created successfully");

      const responses=[];
      for(let i=0;i<numberOfEmails;i++){
        
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
        responses.push(emailRes);
      }
      const results=await Promise.all(responses);
      const jsonResults=await Promise.all(results.map((res)=>res.json()));
      const allSuccess=jsonResults.every((r)=> r.success);

      if(allSuccess){
        alert("All emails generated successfully!");
        navigate(`/emails/${userId}`);
      }else{
        alert("Some emails failed to generate.");
      }

      setJobTitle("");
      setJd("");
      setLocation("");
      setMinExp("");
      setMaxExp("");
      setNumberOfEmails("");
      
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error while connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          Create Job Post
        </h2>

        <input
          type="text"
          placeholder="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <textarea
          placeholder="Job Description"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        ></textarea>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Min Exp"
            value={minExp}
            onChange={(e) => setMinExp(e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Max Exp"
            value={maxExp}
            onChange={(e) => setMaxExp(e.target.value)}
            className="w-1/2 p-2 border rounded"
            required
          />
        </div>

        <input
          type="number"
          placeholder="Number of Emails"
          value={numberOfEmails}
          onChange={(e) => setNumberOfEmails(e.target.value)}
          className="w-full p-2 border rounded mb-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : "Create Email"}
        </button>
      </form>
    </div>
  );
}
