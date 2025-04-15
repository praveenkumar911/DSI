import React, { useState, useEffect } from "react";
import { createClass } from "../services/class";
import { getFellowProfile } from "../services/fellow";

const ClassPage = () => {
  const [standardName, setStandardName] = useState("");
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [students, setStudents] = useState([]);

  const [fellowInfo, setFellowInfo] = useState({
    name: "Sarah Johnson",
    role: "Teaching Fellow",
    email: "sarah.j@tafea.edu",
    mobile: "+1 (555) 123-4567",
    subject: "Mathematics",
    availabilityStatus: "Available",
  });

  useEffect(() => {
    const asyncGetFellowProfile = async () => {
      try {
        const res = await getFellowProfile(localStorage.getItem("token"));
        if (res.status === 200) {
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
    return nameParts.map((part) => part.charAt(0).toUpperCase()).join("");
  };

  const handleAddStudent = () => {
    if (name.trim() !== "" && id.trim() !== "" && standardName !== "") {
      const newStudent = { name: name.trim(), id: id.trim() };
      setStudents([...students, newStudent]);
      setName("");
      setId("");
    } else {
      alert("Please set a class standard and fill all fields.");
    }
  };

  const handleSubmit = () => {
    const asyncCreateClass = async () => {
      try {
        const response = await createClass(
          standardName,
          students.map((student) => ({
            name: student.name,
            roll_no: student.id,
          })),
          localStorage.getItem("token")
        );
        if (response.status === 200) {
          alert("Class created successfully.");
          setStandardName("");
          setName("");
          setId("");
          setStudents([]);
        }
      } catch (error) {
        console.error("Failed to create class:", error);
      }
    };
    asyncCreateClass();
  };

  return (
    <div className="flex justify-center items-center w-screen min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg mb-12 p-6 w-full max-w-5xl">
        <div className="flex flex-wrap items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-[#A393EB] rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {getInitials(fellowInfo.name)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{fellowInfo.name}</h2>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <select
              value={standardName}
              onChange={(e) => setStandardName(e.target.value)}
              className="border rounded py-2 px-4 w-full md:w-auto"
            >
              <option value="" disabled>
                Select class standard
              </option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {`${i + 1} ${i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"} Standard`}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="border rounded py-3 px-4 w-full"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <label htmlFor="id" className="block text-gray-700 font-bold mb-2">
              ID
            </label>
            <input
              type="text"
              id="id"
              className="border rounded py-3 px-4 w-full"
              placeholder="Enter ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-wrap space-x-4">
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
              onClick={handleAddStudent}
            >
              Add Student
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Saved Students</h3>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto"
            style={{ maxHeight: "300px" }}
          >
            {students.map((student, index) => (
              <div key={index} className="bg-gray-100 shadow-md rounded-lg p-4">
                <p className="font-bold">Name: {student.name}</p>
                <p>ID: {student.id}</p>
              </div> 
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
