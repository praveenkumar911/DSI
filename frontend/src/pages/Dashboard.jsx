import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState({}); // Stores notes for each day
  const [activeDay, setActiveDay] = useState(null); // Tracks the active day card

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch("https://pl-api.iiit.ac.in/rcts/dsi-demo1/dashboard/notes")
      .then((res) => res.json())
      .then((data) => {
        const loadedNotes = {};
        data.forEach((note) => {
          loadedNotes[note.day] = { id: note._id, note: note.note };
        });
        setNotes(loadedNotes);
      })
      .catch((error) => console.error("Error fetching notes:", error));
  }, []);

  const handleInputChange = async (day, value) => {
    setNotes((prevNotes) => ({
      ...prevNotes,
      [day]: { ...prevNotes[day], note: value },
    }));

    if (!notes[day]?.id) {
      const response = await fetch("https://pl-api.iiit.ac.in/rcts/dsi-demo1/dashboard/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day,
          month: currentMonth,
          year: currentYear,
          note: value,
        }),
      });
      const data = await response.json();
      setNotes((prevNotes) => ({
        ...prevNotes,
        [day]: { id: data.data._id, note: value },
      }));
    }
  };

  const handleUpdate = async (day) => {
    if (notes[day]?.id) {
      await fetch(`https://pl-api.iiit.ac.in/rcts/dsi-demo1/dashboard/update/${notes[day].id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: notes[day].note }),
      });
      alert(`Note for ${day} updated successfully!`);
    }
  };

  const handleDelete = async (day) => {
    if (notes[day]?.id) {
      await fetch(`https://pl-api.iiit.ac.in/rcts/dsi-demo1/dashboard/delete/${notes[day].id}`, {
        method: "DELETE",
      });
      setNotes((prevNotes) => {
        const updatedNotes = { ...prevNotes };
        delete updatedNotes[day];
        return updatedNotes;
      });
    }
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getStartingDay = (year, month) => new Date(year, month, 1).getDay();

  const generateDays = () => {
    const monthLength = getDaysInMonth(currentYear, currentMonth);
    const startingDay = getStartingDay(currentYear, currentMonth);
    return Array.from({ length: monthLength }, (_, i) => ({
      day: i + 1,
      dayOfWeek: daysOfWeek[(startingDay + i) % 7],
    }));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12);
    if (currentMonth === 11) setCurrentYear((prev) => prev + 1);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12);
    if (currentMonth === 0) setCurrentYear((prev) => prev - 1);
  };

  const handleEdit = (day) => {
    const inputField = document.getElementById(`day-${day}`);
    if (inputField) inputField.focus();
  };

  const renderCalendar = () =>
    generateDays().map((day, index) => (
      <div
        key={index}
        className="p-4 text-center rounded-lg shadow-md bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex flex-col items-center cursor-pointer relative border-2 border-transparent hover:border-gradient"
        onClick={() => setActiveDay(day.day === activeDay ? null : day.day)}
        style={{
          background: "linear-gradient(135deg, rgba(224, 242, 254, 0.8), rgba(233, 213, 255, 0.8))",
        }}
      >
        <p className="text-sm font-semibold text-gray-700">
          {day.day} <span className="text-xs text-gray-500">({day.dayOfWeek})</span>
        </p>
        <input
          id={`day-${day.day}`}
          type="text"
          value={notes[day.day]?.note || ""}
          onChange={(e) => handleInputChange(day.day, e.target.value)}
          className="mt-2 w-full p-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add a note"
        />
        {activeDay === day.day && (
          <div className="flex gap-2 mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(day.day);
              }}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(day.day);
              }}
              className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdate(day.day);
              }}
              className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            >
              Update
            </button>
          </div>
        )}
      </div>
    ));

  // Clock Logic
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const seconds = currentTime.getSeconds();

  const hourDegrees = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour + 0.5 degrees per minute
  const minuteDegrees = minutes * 6 + seconds * 0.1; // 6 degrees per minute + 0.1 degrees per second
  const secondDegrees = seconds * 6; // 6 degrees per second

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-8 pb-20 relative overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-gray-200 text-9xl font-bold opacity-20 transform rotate-45 select-none">
          Tafea
        </span>
      </div>

      <nav className="bg-white shadow-sm border-b w-full py-4 text-center text-xl font-serif italic relative z-10">
        Welcome to Tafea!
      </nav>

      {/* Image & Clock Section */}
      <div className="flex justify-center items-center my-8 space-x-10 relative z-10">
        {/* Image */}
        <img
          src="https://assets.isu.pub/document-structure/230606123750-563d5fdfb0312d8374ffeaeba09deb9b/v1/a4339ec81c38ad5419459d51f7b66543.jpeg"
          alt="Placeholder"
          className="rounded-xl shadow-sm w-full max-w-md object-cover"
        />

        {/* Circular Analog Clock */}
        <div className="relative w-48 h-48 rounded-full border-4 border-gold-500 bg-black shadow-lg">
          {/* Roman Numerals */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num, index) => {
            const angle = (num * 30 * Math.PI) / 180; // 30 degrees per hour
            const radius = 80; // Distance from center
            const x = Math.sin(angle) * radius;
            const y = -Math.cos(angle) * radius;
            const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
            return (
              <div
                key={index}
                className="absolute text-red-500 font-bold text-sm"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {romanNumerals[num - 1]}
              </div>
            );
          })}

          {/* Clock Hands */}
          <div
            className="absolute w-1 h-16 bg-yellow-500 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
              transformOrigin: "bottom center",
            }}
          />
          <div
            className="absolute w-1 h-20 bg-white rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -100%) rotate(${minuteDegrees}deg)`,
              transformOrigin: "bottom center",
            }}
          />
          <div
            className="absolute w-0.5 h-24 bg-red-500 rounded-full"
            style={{ 
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -100%) rotate(${secondDegrees}deg)`,
              transformOrigin: "bottom center",
            }}
          />
        </div>
      </div>

      {/* Right Section: Calendar */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handlePreviousMonth}
            className="bg-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>
          <h2 className="text-2xl font-semibold text-gray-800">
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
            })}{" "}
            {currentYear}
          </h2>
          <button
            onClick={handleNextMonth}
            className="bg-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
          >
            Next
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;