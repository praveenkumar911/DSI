import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getFellowProfile } from "../services/fellow";
import { useEffect } from "react";
function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [fellowInfo, setFellowInfo] = useState({
    name: "Sarah Johnson",
    role: "Teaching Fellow",
    email: "sarah.j@tafea.edu",
    mobile: "+1 (555) 123-4567",
    subject: "Mathematics",
    availabilityStatus: "Available",
  });

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

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join(""); // Join the initials of each name part
  };

  const handleLogout = () => {
    // Perform logout logic (clear tokens, session, etc.)
    console.log("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 z-50">
      {/* Top Bar */}
      <header className="bg-white shadow-lg px-4 py-3 flex items-center justify-between z-50">
        {/* Left: Dropdown Button */}
        <div className="relative">
          <button
            className="text-gray-700 font-medium px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            ☰ Menu
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-md rounded-lg w-48">
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/lessons"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                View Lessons
              </Link>
              <Link
                to="/addclass"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Add Students
              </Link>
              <Link
                to="/classroom"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                ClassRoom
              </Link>
              <Link
                to="/chat"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Chat
              </Link>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
        

        <Link
          to="/profile" 
          className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
            location.pathname === "/profile"
              ? "text-white"
              : "text-gray-300 hover:text-white"
          }`}
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-[#A393EB] text-white font-medium text-sm sm:text-base">
            {getInitials(fellowInfo.name)}
          </div>
        </Link>

        {/* Right: Profile Initials */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        <Outlet />
      </main>

      {/* Bottom Navigation */}

      <nav className="fixed bottom-0 left-0 right-0 bg-[#A393EB] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className={`flex flex-col items-center text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === "/dashboard"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l9-9 9 9M9 21V9h6v12"
                />
              </svg>
              <span>Dashboard</span>
            </Link>
            <Link
              to="/lessons"
              className={`flex flex-col items-center text-xs sm:text-sm font-medium transition-all duration-200 ${
                location.pathname === "/lessons"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
                />
              </svg>
              <span>Lessons</span>
            </Link>
            {/* Chat Link */}
            <Link
              to="/feedback"
              className={`flex flex-col items-center text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                location.pathname === "/feedback"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
              <span>Feedback</span>
            </Link>

            {/* Add Student Link */}
            <Link
              to="/addclass"
              className={`flex flex-col items-center text-xs sm:text-sm md:text-base font-medium transition-all duration-200 ${
                location.pathname === "/addclass"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                />
              </svg>
              <span>Add Student</span>
            </Link>

            <Link
              to="/classroom"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/classroom"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 mb-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                />
              </svg>
              <span>ClassRoom</span>
            </Link>

            <Link
              to="/analytics"
              className={`flex flex-col items-center text-sm font-medium transition-all duration-200 ${
                location.pathname === "/analytics"
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.707 9.707 0 01-4-.812l-4.243 1.061a1 1 0 01-1.235-1.235l1.06-4.243A9.707 9.707 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default RootLayout;
