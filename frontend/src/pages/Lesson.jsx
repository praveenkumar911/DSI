import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LessonPlans = () => {
  const [activeTab, setActiveTab] = useState("planned");
  const [activity, setActivity] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [lessonDate, setLessonDate] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [error, setError] = useState("");
  const [skills, setSkills] = useState([]);
  const [teams, setTeams] = useState([]); // State for teams
  const [originalLessons, setOriginalLessons] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState({});

  useEffect(() => {
    // Fetch skills from the backend
    fetch('https://pl-api.iiit.ac.in/rcts/dsi-demo1/api/lessons/getSkills')
      .then(response => response.json())
      .then(data => setSkills(data.skills))
      .catch(error => console.error('Error fetching skills:', error));
  }, []);

  const fetchStudents = (className) => {
    fetch(`https://pl-api.iiit.ac.in/rcts/dsi-demo1/api/classes/getClasses/${className}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        return response.json();
      })
      .then((data) => {
        if (data.students) {
          setStudents(data.students);
          setError("");
        } else {
          setError("No students found for this class.");
        }  
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching students data");
      });
  };

  const handleClassChange = (event) => {
    const selected = event.target.value;
    setSelectedClass(selected);
    setStudents([]);
    setError("");
    if (selected) {
      fetchStudents(selected);
    }
  };

  const handleSaveActivity = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    // Make sure all required fields are filled
    if (!activity || !selectedClass || !lessonDate || !lessonDuration || !skills || skills.length === 0) {
      toast.error("All fields are required.");
      return;
    }

    const lessonData = {
      lesson_name: activity,
      classId: selectedClass, // Make sure this is a valid MongoDB ObjectId
      lessonDate,
      lessonDuration,
      skills, // Make sure this is an array
    };

    console.log("Sending data:", lessonData); // For debugging

    fetch('https://pl-api.iiit.ac.in/rcts/dsi-demo1/api/lessons/newLesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(lessonData),
    })
      .then(response => {
        // Store the response status
        const isResponseOk = response.ok;
        return response.json().then(data => {
          // Return both the data and the status
          return { data, isResponseOk };
        });
      })
      .then(({ data, isResponseOk }) => {
        if (data.error) {
          throw new Error(data.error);
        }
        if (!isResponseOk) {
          throw new Error(data.message || 'Failed to save activity');
        }
        console.log('Success:', data);
        toast.success("Activity saved successfully!");
      })
      .catch((error) => {
        console.error('Error details:', error);
        toast.error(error.message || "Failed to save activity");
      });
  };

  // Fetch saved lessons when the "Splitting teams in classroom" tab is active
  useEffect(() => {
    if (activeTab === "completed") {
      fetchSavedLessons();
    }
  }, [activeTab]);

  const fetchSavedLessons = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }
  
    try {
      const response = await fetch('https://pl-api.iiit.ac.in/rcts/dsi-demo1/api/lessons/getLessons', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Fetched lessons:', data.lessons);
  
      // Store original lessons for reference
      setOriginalLessons(data.lessons);
  
      // Set teams state to the original lessons format
      setTeams(data.lessons);
  
      // Initialize selected activities for each student
      const activitiesMap = {};
      data.lessons.forEach((lesson) => {
        if (lesson.students && Array.isArray(lesson.students)) {
          lesson.students.forEach((student) => {
            if (!activitiesMap[student._id]) {
              activitiesMap[student._id] = lesson.lesson_name; // Default to the first activity
            }
          });
        }
      });
      setSelectedActivities(activitiesMap);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error("Failed to fetch lessons: " + error.message);
    }
  };

  const handleActivityChange = (studentId, selectedActivity) => {
    setSelectedActivities((prev) => ({
      ...prev,
      [studentId]: selectedActivity,
    }));
  };

  const resetTeams = () => {
    setTeams(originalLessons);
    toast.info("Reset to original lessons list");
  };

  const splitIntoTeams = () => {
    if (!teams || teams.length === 0) {
      toast.error("No lessons found to create teams");
      return;
    }

    // Create a flat array of all students with their activity names
    const allStudents = [];

    teams.forEach((lesson) => {
      if (lesson.students && Array.isArray(lesson.students)) {
        lesson.students.forEach((student) => {
          allStudents.push({
            _id: student._id || `temp-${Math.random().toString(36).substring(2, 9)}`,
            name: student.name || "Unknown",
            roll_no: student.roll_no || "N/A",
            activity: lesson.lesson_name || "Unknown Activity",
          });
        });
      }
    });

    if (allStudents.length === 0) {
      toast.error("No students found in any lessons");
      return;
    }

    // Shuffle students for random team assignment
    const shuffledStudents = [...allStudents].sort(() => Math.random() - 0.5);

    // Create teams of 4 students each (or fewer for the last team)
    const teamSize = 4;
    const teamsArray = [];

    for (let i = 0; i < shuffledStudents.length; i += teamSize) {
      const team = shuffledStudents.slice(i, i + teamSize);
      teamsArray.push(team);
    }

    // Update state with the created teams
    setTeams(teamsArray);
    toast.success(`Created ${teamsArray.length} teams with ${allStudents.length} students`);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="w-full bg-white">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 overflow-x-auto" aria-label="Tabs">
            <button
              id="tab-planned"
              onClick={() => setActiveTab("planned")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "planned"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Add Activity to students
            </button>
            <button
              id="tab-completed"
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-pink-500 text-pink-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Splitting teams in classroom
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {activeTab === "planned" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Add Activity to Students</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Activity</label>
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Enter activity"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Class Standard</label>
                <select
                  className="border rounded py-2 px-4 w-full"
                  value={selectedClass}
                  onChange={handleClassChange}
                >
                  <option value="">Select class standard</option>
                  <option value="1">1st Standard</option>
                  <option value="2">2nd Standard</option>
                  <option value="3">3rd Standard</option>
                  <option value="4">4th Standard</option>
                  <option value="5">5th Standard</option>
                  <option value="6">6th Standard</option>
                  <option value="7">7th Standard</option>
                  <option value="8">8th Standard</option>
                  <option value="9">9th Standard</option>
                  <option value="10">10th Standard</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lesson Date</label>
                <input
                  type="date"
                  value={lessonDate}
                  onChange={(e) => setLessonDate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Lesson Duration (minutes)</label>
                <input
                  type="number"
                  value={lessonDuration}
                  onChange={(e) => setLessonDuration(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  placeholder="Enter duration in minutes"
                />
              </div>
              {selectedClass && students.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Students</label>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Roll Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.roll_no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {selectedClass && students.length === 0 && !error && (
                <p className="mt-4">No students found for this class.</p>
              )}
              {error && <p className="mt-4 text-red-500">{error}</p>}
              <button
                onClick={handleSaveActivity}
                className="bg-green-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-green-600"
              >
                Save Activity
              </button>
            </div>
          )}

          {activeTab === "completed" && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Splitting Teams in Classroom</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Students and Activities</label>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Array.isArray(teams) && teams.flatMap((team) =>
                      Array.isArray(team) && team.map((student) => (
                        <tr key={student._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {student.roll_no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {selectedActivities[student._id] || student.activity}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex space-x-4 mb-4">
                <button
                  onClick={splitIntoTeams}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-blue-600"
                >
                  Split into Teams
                </button>
                
                <button
                  onClick={resetTeams}
                  className="bg-gray-500 text-white px-3 py-1 rounded-md shadow-sm hover:bg-gray-600"
                >
                  Reset Teams
                </button>
              </div>

              {/* Render teams after splitting */}
              {Array.isArray(teams) && teams.length > 0 && teams[0] && Array.isArray(teams[0]) ? (
                teams.map((team, index) => (
                  <div key={index} className="mb-4 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-md font-semibold mb-2">Team {index + 1}</h3>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Roll Number
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Activity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {team.map((student, studentIndex) => (
                          <tr key={student._id || studentIndex}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {student.roll_no}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {selectedActivities[student._id] || student.activity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))
              ) : null}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LessonPlans;