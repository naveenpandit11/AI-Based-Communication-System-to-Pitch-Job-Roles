import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserIdInput() {
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const userAgent = navigator.userAgent;

  const handleNext = async (e) => {
    e.preventDefault();
    if (!userId.trim()) return alert("Please enter a User ID");

    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();


      

      // Check if user exists
      const userRes = await fetch(`http://localhost:7001/api/user/${userId}`, {
        credentials: "include",
      });
      const userData = await userRes.json();
      if(userData.exists){
        navigate(`/main/${userId}`);
      }else{
        navigate(`/profile/${userId}`)
      }

      await fetch("http://localhost:7001/api/user-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: userId,
          ipAddress: ipData.ip,
          userAgent: userAgent,
        }),
      });

    } catch (err) {
      console.error("Error:", err);
      navigate(`/profile/${userId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleNext}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <label className="block text-gray-700 font-medium mb-2">
          Enter User ID
        </label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. U143"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Next
        </button>
      </form>
    </div>
  );
}
