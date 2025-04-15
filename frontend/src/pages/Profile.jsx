import React, { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  Book,
  Users,
  Clock,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getFellowProfile } from "../services/fellow";

export default function Profile() {
  const [fellowInfo, setFellowInfo] = useState({
    name: "Sarah Johnson",
    role: "Teaching Fellow",
    email: "sarah.j@tafea.edu",
    mobile: "+1 (555) 123-4567",
    subject: "Mathematics",
    availabilityStatus: "Available",
  });

  const [showPopup, setShowPopup] = useState(false); // State to toggle popup

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch fellow profile data
    const asyncGetFellowProfile = async () => {
      try {
        const res = await getFellowProfile(localStorage.getItem("token"));
        // console.log("Fellow profile data:", res.data);
        if (res.status == 200) {
          setFellowInfo(res.data);
        }
      } catch (error) {
        console.error("Error fetching fellow profile:", error.message);
      }
    };
    asyncGetFellowProfile();
  }, []);

  const statsInfo = {
    activities: {
      completed: 0,
      PendingReports: 0,
    },
  };
  

  // Function to get the first letters of the name parts 
  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join(""); // Join the initials of each name part
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col items-center md:items-start">
              <div className="w-20 h-20 bg-[#A393EB] rounded-full flex items-center justify-center text-white text-xl font-semibold mb-4">
                {getInitials(fellowInfo.name)} {/* Displaying the initials */}
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                {fellowInfo.name}
              </h1>
              <p className="text-[#A393EB] font-medium">Teaching Fellow</p>
            </div>

            {/* Contact Information */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-0 md:ml-8">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-[#A393EB]" />
                <span>{fellowInfo.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-[#A393EB]" />
                <span>{fellowInfo.mobile}</span>
              </div>

            </div>

            {/* Status Badge */}
            <div className="bg-green-100 px-4 py-2 rounded-full text-green-700 text-sm font-medium">
              {fellowInfo.availabilityStatus}
            </div>
          </div>
        </div>

        {/* Stats and Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activities Stats */}
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Activities Overview
              </h2>
              <Users className="w-5 h-5 text-[#A393EB]" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600">Completed</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {statsInfo.activities.completed}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#A393EB]"></div>
                  <span className="text-gray-600">Pending Reports</span>
                </div>
                <span className="font-semibold text-gray-800">
                  {statsInfo.activities.PendingReports}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 sm:px-0 mb-10">
  <button
    onClick={() => navigate("/dashboard")}
    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#A393EB] text-white rounded-xl hover:bg-[#8A7CD4] transition-colors text-sm sm:text-base"
  >
    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Dashboard</span>
  </button>

  <button
    onClick={() => navigate("/lessons")}
    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#A393EB] text-white rounded-xl hover:bg-[#8A7CD4] transition-colors text-sm sm:text-base"
  >
    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>View Lessons</span>
  </button>

  <button
    onClick={() => navigate("/analytics")}
    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#A393EB] text-white rounded-xl hover:bg-[#8A7CD4] transition-colors text-sm sm:text-base"
  >
    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Analytics</span>
  </button>

  <button
    onClick={() => setShowPopup(true)} // Show popup on click
    className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[#A393EB] text-[#A393EB] rounded-xl hover:bg-[#A393EB] hover:text-white transition-colors text-sm sm:text-base"
  >
    <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
    <span>Edit Profile</span>
  </button>
</div>

          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/2 max-w-lg rounded-xl shadow-lg p-6 relative">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                console.log("first")
                try {
                  const response = await fetch("http://localhost:5001/api/profile/update", {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Include token if authentication is required
                    },
                    body: JSON.stringify(fellowInfo),
                  });
                  const updatedProfile = await response.json();
                  console.log("Profile updated:", updatedProfile);
                  setShowPopup(false); // Close popup after successful update
                } catch (error) {
                  console.log(error)
                  console.error("Error updating profile:", error.message);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={fellowInfo.name}
                  onChange={(e) =>
                    setFellowInfo({ ...fellowInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={fellowInfo.email}
                  onChange={(e) =>
                    setFellowInfo({ ...fellowInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="number"
                  value={fellowInfo.mobile}
                  onChange={(e) =>
                    setFellowInfo({ ...fellowInfo, mobile: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A393EB]"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-[#A393EB] text-white rounded-lg hover:bg-[#8A7CD4]"
                >
                  Save
                </button>
              </div>
            </form>
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


