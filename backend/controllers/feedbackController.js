const Feedback = require("../models/Feedback");

exports.updateFeedback = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { marks, feedback, name, standard } = req.body;

    let studentFeedback = await Feedback.findOne({ studentId });

    if (studentFeedback) {
      // Update existing feedback 
      studentFeedback.marks = marks;
      studentFeedback.feedback = feedback;
      studentFeedback.name = name;
      studentFeedback.standard = standard;
      await studentFeedback.save();
      return res.status(200).json({ message: "Feedback updated successfully", studentFeedback });
    } else {
      // If no feedback exists, create a new entry
      const newFeedback = new Feedback({
        studentId,
        name,
        standard,
        marks,
        feedback
      });
      await newFeedback.save();
      return res.status(201).json({ message: "Feedback created successfully", newFeedback });
    }
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ error: "Failed to update feedback" });
  }
};

exports.getStudentFeedback = async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentFeedback = await Feedback.findOne({ studentId });

    if (studentFeedback) {
      return res.status(200).json({ studentFeedback });
    } else {
      return res.status(404).json({ message: "No feedback found for this student" });
    }
  } catch (error) {
    console.error("Error fetching student feedback:", error);
    res.status(500).json({ error: "Failed to fetch student feedback" });
  }
};

exports.getStudentsByStandard = async (req, res) => {
  try {
    const { standard } = req.params;
    const students = await Feedback.find({ standard });

    if (students.length > 0) {
      return res.status(200).json({ students });
    } else {
      return res.status(404).json({ message: "No students found for this standard" });
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};
