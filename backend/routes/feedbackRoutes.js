const express = require("express");
const { Feedback } = require("../models/model"); // Correctly import Feedback
const router = express.Router();

// Save Student Progress into Feedback Collection
router.post("/saveProgress", async (req, res) => {
  try {
    const { students } = req.body;
    console.log("Received students data:", students); // Debugging

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: "Invalid student data" });
    }

    // Store feedback data for each student
    await Promise.all(
      students.map(async (student) => {
        console.log("Saving student:", student); // Debugging 
        await Feedback.findOneAndUpdate(
          { studentId: student._id }, // Find by student ID
          {
            studentId: student._id,
            name: student.name,
            standard: student.standard,
            marks: student.marks || {}, // Ensure marks is an object
            feedback: student.feedback || "", // Ensure feedback is a string
            performance: student.performance || [], // Ensure performance is an array
          },
          { new: true, upsert: true }
        );
      })
    );

    res.status(200).json({ message: "Student progress stored successfully!" });
  } catch (error) {
    console.error("Error saving student progress:", error); // Debugging
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Fetch Student-Specific Data
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student's feedback data
    const studentFeedback = await Feedback.findOne({ studentId });
    console.log("Fetched student feedback:", studentFeedback); // Debugging

    if (!studentFeedback) {
      return res.status(404).json({ error: "Student data not found" });
    }

    // Extract relevant data for analytics
    const studentData = {
      skillScores: studentFeedback.marks
        ? Object.values(studentFeedback.marks)
        : [0, 0, 0, 0, 0, 0], // Default skill scores
      performance: studentFeedback.performance || [0, 0, 0, 0], // Default performance data
    };

    res.status(200).json(studentData);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;