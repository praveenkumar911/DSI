import React, { useState, useEffect, useRef } from "react";

const Classesroom = () => {
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editStudent, setEditStudent] = useState(null);

  const studentsEndRef = useRef(null); 

  const fetchStudents = (className) => {
    setLoading(true);
    fetch(`http://localhost:5001/api/classes/getClasses/${className}`)
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
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching students data");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (selectedClass) {
      fetchStudents(selectedClass);
    } else {
      setStudents([]);
      setError("");
    }
  }, [selectedClass]);

  useEffect(() => {
    if (studentsEndRef.current) {
      studentsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [students]);

  const handleClassChange = (event) => {
    const selected = event.target.value;
    setSelectedClass(selected);
    setStudents([]);
    setError("");
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (editStudent) {
      fetch(`http://localhost:5001/api/students/update/${editStudent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editStudent),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.student) {
            setStudents((prevStudents) =>
              prevStudents.map((student) =>
                student._id === data.student._id ? data.student : student
              )
            );
            setEditStudent(null);
          } else {
            setError("Failed to update student.");
          }
        })
        .catch((err) => {
          console.error(err);
          setError("Error updating student.");
        });
    }
  };

  const handleCancel = () => {
    setEditStudent(null);
  };

  const handleDeleteStudent = (studentId) => {
    fetch(`http://localhost:5001/api/students/delete/${studentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Student deleted successfully") {
          setStudents((prevStudents) =>
            prevStudents.filter((student) => student._id !== studentId)
          );
        } else {
          setError(data.message || "Failed to delete student");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error deleting student");
      });
  };

  const handlePromoteStudent = (studentId) => {
    fetch(`http://localhost:5001/api/students/promote/${studentId}`, {
      method: "PATCH",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.student) {
          setStudents((prevStudents) =>
            prevStudents.map((student) =>
              student._id === data.student._id ? data.student : student
            )
          );
        } else {
          setError("Failed to promote student.");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Error promoting student.");
      });
  };

  return (
    <div className="flex justify-center items-center w-screen h-fit">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-5xl h-fit mb-20 mt-10">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold">
            {selectedClass ? `${selectedClass} Standard` : "Select a Class"}
          </h2>
          <div className="flex items-center space-x-4 mt-4">
            <select
              className="border rounded py-2 px-4"
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
        </div>

        {selectedClass && students.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Students</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-gray-100 shadow-md rounded-lg p-4"
                >
                  {editStudent && editStudent._id === student._id ? (
                    <div>
                      <input
                        type="text"
                        name="name"
                        value={editStudent.name}
                        onChange={handleChange}
                        className="border p-2 rounded mb-2 w-full"
                      />
                      <input
                        type="text"
                        name="roll_no"
                        value={editStudent.roll_no}
                        onChange={handleChange}
                        className="border p-2 rounded mb-2 w-full"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleSave}
                          className="bg-blue-500 text-white py-1 px-4 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-500 text-white py-1 px-4 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold">Name: {student.name}</p>
                      <p>ID: {student.roll_no}</p>
                      <div className="flex justify-between mt-2">
                        <button
                          onClick={() => handleEditStudent(student)}
                          className="text-blue-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student._id)}
                          className="text-red-500"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => handlePromoteStudent(student._id)}
                          className="text-green-500"
                        >
                          Promote
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedClass && students.length === 0 && !error && (
          <p className="mt-4">No students found for this class.</p>
        )}
        <div ref={studentsEndRef} />
      </div>
    </div>
  );
};

export default Classesroom;
