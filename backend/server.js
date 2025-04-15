require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const userRoute = require('./routes/userRoutes');
const messagesRoute = require('./routes/messageRoutes');
const classRoute = require('./routes/classRoutes');
const chatRoute = require('./routes/chatRoutes');
const feedbackRoute = require('./routes/feedbackRoutes');
const lessonRoute = require('./routes/lessonRoutes');
const updatedProfile = require('./routes/useredit');
const { Student, Class } = require('./models/model');
const classroomRoutes = require('./routes/classroomRoutes');
const dashboardRoutes = require('./routes/dashboardroutes');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', userRoute);
app.use('/api/messages', messagesRoute);
app.use('/api/classes', classRoute);
app.use('/api/chat', chatRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/lessons', lessonRoute);
app.use('/api/profile', updatedProfile);
app.use('/api/classroom', classroomRoutes);
app.use('/dashboard', dashboardRoutes);

// Get Classes Based on Standard
app.get('/api/classes/getClasses/:standard', async (req, res) => {
  const { standard } = req.params;

  try {
    const classes = await Class.find({ standard });

    if (classes.length === 0) {
      return res.status(404).json({ error: 'No classes found for this standard.' });
    }

    const studentIds = classes.reduce((acc, currentClass) => acc.concat(currentClass.students), []);
    const students = await Student.find({ roll_no: { $in: studentIds } });

    if (students.length > 0) {
      res.status(200).json({ students });
    } else {
      res.status(404).json({ error: 'No students found for the given class standard.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update Student Info 
app.put('/api/students/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, roll_no } = req.body;

  try {
    const student = await Student.findByIdAndUpdate(id, { name, roll_no }, { new: true });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ message: 'Student updated', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating student' });
  }
});

// Delete Student
app.delete('/api/students/delete/:id', async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting student' });
  }
});

// Promote Student to Next Standard
app.patch('/api/students/promote/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    student.standard += 1;
    const updatedStudent = await student.save();

    res.status(200).json({ message: 'Student promoted successfully', student: updatedStudent });
  } catch (err) {
    res.status(500).json({ error: 'Failed to promote student', details: err });
  }
});

// Save Student Progress (Marks & Feedback)
app.post('/api/students/progress', async (req, res) => {
  try {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ error: 'Invalid student data' });
    }

    const updatePromises = students.map(student =>
      Student.findByIdAndUpdate(
        student.id,
        { name: student.name, standard: student.standard, marks: student.marks, feedback: student.feedback },
        { new: true, upsert: true } // Create if not exists
      )
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: 'Student progress saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving student progress' });
  }
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
