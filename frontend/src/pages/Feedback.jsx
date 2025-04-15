import React, { useState, useEffect } from "react";
import axios from "axios";

const ClassProgressReport = () => {
  const [selectedStandard, setSelectedStandard] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(""); // Add this line
  const [error, setError] = useState("");

  // Fetch students for the selected standard
  useEffect(() => {
    if (selectedStandard) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/classes/getClasses/${selectedStandard}`
          );
          if (response.data.students && response.data.students.length > 0) {
            const initializedStudents = response.data.students.map((student) => ({
              ...student,
              marks: student.marks || "",
              feedback: student.feedback || "",
            }));
            setStudents(initializedStudents);
            setError("");
          } else {
            setStudents([]);
            setError("No students found for this standard.");
          }
        } catch (error) {
          console.error("Error fetching students:", error);
          setError("Failed to fetch students. Please try again.");
          setStudents([]);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
      setError("");
    }
  }, [selectedStandard]);

  const handleInputChange = (studentId, field, value) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student._id === studentId ? { ...student, [field]: value } : student
      )
    );
  };

  const handleSaveProgress = async () => {
    try {
      const studentsData = students.map((student) => ({
        _id: student._id,
        name: student.name,
        standard: selectedStandard,
        marks: {
          communication: parseInt(student.marks), // Example: Convert marks to key-value pairs
          confidence: 0, // Add other skills as needed
          leadership: 0,
          selfDiscipline: 0,
          empathy: 0,
          timeManagement: 0,
        },
        feedback: student.feedback || "", // Ensure feedback is a string
      }));

      const response = await axios.post(
        "http://localhost:5001/api/feedback/saveProgress",
        { students: studentsData }
      );

      if (response.data.message === "Student progress stored successfully!") {
        alert("All student progress saved successfully!");
      } else {
        alert("Failed to save student progress.");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
      setError("Failed to save student progress.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 mb-20 display flex flex-col items-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Class Progress Report</h2>

      <select
        className="border rounded p-2 mb-4"
        value={selectedStandard}
        onChange={(e) => setSelectedStandard(e.target.value)}
      >
        <option value="">Select Standard</option>
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}th Standard
          </option>
        ))}
      </select>

      {error && <p className="mt-4 text-red-500">{error}</p>}
      {students.length > 0 ? (
        <>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200" >
                <th className="border p-2">Name</th>
                <th className="border p-2">Roll Number</th>
                <th className="border p-2">Marks</th>
                <th className="border p-2">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="text-center">
                  <td className="border p-2">{student.name}</td>
                  <td className="border p-2">{student.roll_no}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={student.marks}
                      onChange={(e) => handleInputChange(student._id, "marks", e.target.value)}
                      className="w-full border rounded p-1 text-center"
                      placeholder="Enter marks"
                    />
                  </td>
                  <td className="border p-2">
                    <textarea
                      value={student.feedback}
                      onChange={(e) => handleInputChange(student._id, "feedback", e.target.value)}
                      className="w-full border rounded p-1"
                      placeholder="Write feedback"
                      rows="2"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSaveProgress}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Progress
          </button>
        </>
      ) : selectedStandard && !error && (
        <p className="mt-4 text-gray-500">No students found for this standard.</p>
      )}
    </div>
  );
};

export default ClassProgressReport;