import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function MainPage() {
  const { userId } = useParams();
  const navigate=useNavigate();
  

   const handleGenerateEmail=async(e)=>{
       e.preventDefault();
       navigate(`/job/${userId}`);

//       const response=await fetch("http://localhost:7001/api/email/generate-email",{
//       method:"POST",
//       headers:{"Content-Type":"application/json"},
//       body: JSON.stringify({_id:String(userId), jobDescription}),
//     });
//     const data = await response.json();
//   console.log(data);
   };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="p-6 bg-white shadow-md rounded-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Main Page</h1>
        <p className="text-gray-700">
          {" "}
          This is just a template page after login.
        </p>
        <p>
          User ID: <span className="font-semibold">{userId}</span>
        </p>
        <button
          type="submit"
          onClick={(e)=>handleGenerateEmail(e)}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Generate Mail
        </button>
        <button
          onClick={() => navigate(`/emails/${userId}`)}
          className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
        >
          Emails

        </button>
      </div>
    </div>
  );
}
