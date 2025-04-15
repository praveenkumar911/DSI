import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

function Analytics() {
  const [selectedStandard, setSelectedStandard] = useState(1);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentData, setStudentData] = useState({
    skillScores: [10, 12, 8, 15, 9, 14], // Default skill scores
    performance: [3, 4, 2, 5], // Default performance trend
    feedback: "",
  });

  useEffect(() => {
    if (selectedStandard) {
      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/classes/getClasses/${selectedStandard}`
          );
          setStudents(response.data.students || []);
        } catch (error) {
          console.error("Error fetching students:", error);
          setStudents([]);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
    }
  }, [selectedStandard]);

  useEffect(() => {
    if (selectedStudent) {
      setStudentData({
        skillScores: [12, 14, 10, 13, 11, 15], // Default analysis before fetching real data 
        performance: [4, 3, 2, 5],
        feedback: "",
      });

      const fetchStudentData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/student/${selectedStudent}`
          );
          const { marks, performance, feedback } = response.data;
          setStudentData({
            skillScores: marks ? Object.values(marks) : [12, 14, 10, 13, 11, 15],
            performance: performance || [4, 3, 4, 5],
            feedback: feedback || "",
          });
        } catch (error) {
          console.error("Error fetching student data:", error);
          setStudentData({ skillScores: [12, 14, 10, 13, 11, 15], performance: [4, 3, 4, 5], feedback: "" });
        }
      };
      fetchStudentData();
    }
  }, [selectedStudent]);

  const skills = [
    "communication",
    "confidence",
    "leadership",
    "selfDiscipline",
    "empathy",
    "timeManagement",
  ];

  const skillsData = {
    labels: skills,
    datasets: [
      {
        label: "Skill Scores",
        data: studentData.skillScores,
        backgroundColor: [
          "#ff9999",
          "#66b3ff",
          "#99ff99",
          "#ffcc99",
          "#c0b9f8",
          "#ffb3e6",
        ],
      },
    ],
  };

  const skillsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Skill Scores for ${selectedStudent || "Selected Student"}`,
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 20 },
      x: { title: { display: true, text: "Skills" } },
    },
  };

  const performanceDates = ["10 Sep", "20 Sep", "30 Sep", "10 Oct"];
  const performanceData = {
    labels: performanceDates,
    datasets: [
      {
        label: "Performance Over Time",
        data: studentData.performance,
        fill: false,
        borderColor: "#66b3ff",
        tension: 0.2,
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Performance Trends",
        font: { size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, max: 5, title: { display: true, text: "Scores" } },
      x: { title: { display: true, text: "Dates" } },
    },
  };

  return (
    <div className="max-w-6xl mx-auto p-4 pb-10">
      <h1 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Student Analytics Dashboard
      </h1>

      <div className="flex justify-center mb-6">
        {Array.from({ length: 10 }, (_, i) => (
          <button
            key={i + 1}
            className={`px-4 py-2 mx-2 rounded ${
              selectedStandard === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            } hover:bg-blue-300`}
            onClick={() => setSelectedStandard(i + 1)}
          >
            Standard {i + 1}
          </button>
        ))}
      </div>

      <div className="flex justify-center mb-6">
        <select
          className="border rounded p-2"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select a Student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} (Roll No: {student.roll_no})
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && (
        <div className="flex flex-wrap gap-4 justify-center">
          <div className="flex-1 bg-white p-6 rounded-lg shadow mb-10 relative" style={{ height: "350px", minWidth: "400px" }}>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Skill Distribution Overview</h2>
            <Bar data={skillsData} options={skillsOptions} height={400} />
          </div>

          <div className="flex-1 bg-white p-6 rounded-lg shadow mb-10 relative" style={{ height: "350px", minWidth: "400px" }}>
            <h2 className="text-xl font-bold text-blue-700 mb-4">Performance Trends</h2>
            <Line data={performanceData} options={performanceOptions} height={400} />
          </div>

          {/* Feedback Section (Only shows if feedback exists) */}
          {studentData.feedback && (
            <div className="flex-1 bg-white p-6 rounded-lg shadow mb-10">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Feedback</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">{studentData.feedback}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Analytics;
