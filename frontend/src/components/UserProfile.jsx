import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UserProfileForm() {
  const { userId } = useParams();
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    dob: "",
    experience: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const res=await fetch("http://localhost:7001/api/user-profile",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        credentials:"include",
        body:JSON.stringify({
          _id:userId,
          ...formData,
        }),
      });
      const data=await res.json();
      console.log("Profile Saved:", data);
      navigate(`/main/${userId}`);
      
    }catch (err){
      console.error(err);
    }

    console.log("User Profile Submitted:", formData);
    navigate(`/main/${userId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          User Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Experience (in years)</label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g. 2"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600">Skills</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="List your skills (comma separated)"
              rows="3"
            ></textarea>
          </div>

      
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
