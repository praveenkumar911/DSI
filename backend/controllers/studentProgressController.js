const { Student, Class } = require('../models/model');

const saveStudentProgress = async (req, res) => {
  try {
    const { students } = req.body; // Expecting array of student progress data 

    if (!students || !Array.isArray(students)) {
      return res.status(400).json({ error: 'Invalid student data' });
    }

    // Update each student's progress
    const updatedStudents = await Promise.all(
      students.map(async (studentData) => {
        const { studentId, marks, feedback } = studentData;

        const student = await Student.findById(studentId);
        if (!student) {
          throw new Error(`Student not found: ${studentId}`);
        }

        // Update student with marks and feedback
        student.marks = marks;
        student.feedback = feedback;
        await student.save();

        // Ensure student is linked to their class
        await Class.updateOne(
          { standard: student.standard, students: studentId },
          { $set: { 'students.$': studentId } },
          { upsert: true }
        );

        return student;
      })
    );

    res.status(200).json({
      message: 'Student progress saved successfully',
      students: updatedStudents
    });
  } catch (error) {
    console.error('Error saving student progress:', error);
    res.status(500).json({ error: 'Failed to save student progress' });
  }
};

module.exports = { saveStudentProgress };