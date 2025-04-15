const express = require('express');
const router = express.Router();

require("dotenv").config();
const jwt = require('jsonwebtoken')
const {
    Class,
    Student,
    Fellow
} = require('../models/model')

const createStudent = async (req, res) => {
    console.log(req.body)
    try {
        const { name, roll_no, classId } = req.body;

        // Validate request body
        if (!name || !roll_no || !classId) {
            return res.status(400).json({ message: 'All fields are required: name, roll_no, classId, schoolId.' });
        }

        // Check if the class exists
        const classExists = await Class.findById(classId);
        console.log(classExists)
        if (!classExists) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        // Create a new student document
        const student = new Student({ name, roll_no, classId });
        console.log(student)

        // Save the student to the database
        const savedStudent = await student.save();

        // Respond with the created student
        return res.status(200).json({
            message: 'Student created successfully.',
            student: savedStudent,
        });
    } catch (error) {
        console.error('Error creating student:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const createClass = async (req, res) => {
    try {
        const { standard, students, token } = req.body;

        if (!standard || !students || !Array.isArray(students)) {
            return res.status(400).json({ message: 'Standard and students (array) are required.' });
        }

        const fellowMail = jwt.verify(token, process.env.JWT_SECRET).mail;

        const classDocument = new Class({
            standard,
            students: students.map((student) => student.roll_no),
        });
        const savedClass = await classDocument.save();

        const createdStudents = [];
        for (const student of students) {
            const { name, roll_no } = student;

            if (!name || !roll_no) {
                return res.status(400).json({
                    message: 'Each student must have a name and roll_no.',
                });
            }

            const newStudent = new Student({
                name,
                roll_no,
                classId: savedClass._id,
            });

            const savedStudent = await newStudent.save();
            createdStudents.push(savedStudent);
        }

        const fellow = await Fellow.findOne({ email: fellowMail });
        if(!fellow) {
            return res.status(404).json({ message: 'Fellow not found.' });
        }

        fellow.classes.push(savedClass._id);

        await fellow.save();

        return res.status(200).json({
            message: 'Class and students created successfully.',
            class: savedClass,
            students: createdStudents,
        });
    } catch (error) {
        console.error('Error creating class and students:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const getClassesByFellow = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'Token is required.' });
        }

        const fellowMail = jwt.verify(token, process.env.JWT_SECRET).mail;

        const fellow = await Fellow.findOne({ email: fellowMail });

        if (!fellow) {
            return res.status(404).json({ message: 'Fellow not found.' });
        }

        let classes = []

        for (const classId of fellow.classes) {
            const classDocument = await Class.findById(classId);
            classes.push(classDocument);
        }

        return res.status(200).json({
            message: 'Classes fetched successfully.',
            classes: classes,
        });

    } catch (error) {
        console.error('Error fetching classes:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const getStudentsByClass = async (req, res) => {
    try {
      const { classId } = req.params;
  
      if (!classId) {
        return res.status(400).json({ message: 'Class ID is required.' });
      }
  
      const students = await Student.find({ classId });
  
      if (!students || students.length === 0) {
        return res.status(404).json({ message: 'No students found for this class.' });
      }
  
      return res.status(200).json({
        message: 'Students fetched successfully.',
        students,
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  const saveStudentScores = async (req, res) => {
    try {
      const { studentId, scores } = req.body;
  
      if (!studentId || !scores || !Array.isArray(scores)) {
        return res.status(400).json({ message: 'Student ID and scores (array) are required.' });
      }
  
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found.' });
      }
  
      // Update student's skills
      student.skills = scores;
      await student.save();
  
      return res.status(200).json({
        message: 'Scores saved successfully.',
        student,
      });
    } catch (error) {
      console.error('Error saving scores:', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }

  const getStudentsByStandard = async (req, res) => {
    try {
        const { standard } = req.params;
        console.log(`Fetching students for standard: ${standard}`);

        // Find the class with the given standard
        const classDoc = await Class.findOne({ standard });

        if (!classDoc) {
            return res.status(404).json({ message: 'Class not found for the given standard.' });
        }

        // Fetch students belonging to this class 
        const students = await Student.find({ classId: classDoc._id });

        if (!students || students.length === 0) {
            return res.status(404).json({ message: 'No students found for this standard.' });
        }

        return res.status(200).json({
            message: 'Students fetched successfully.',
            students,
        });
    } catch (error) {
        console.error('Error fetching students:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports = {
    createStudent,
    createClass,
    getClassesByFellow,
    getStudentsByClass,
    saveStudentScores,
    getStudentsByStandard,
};