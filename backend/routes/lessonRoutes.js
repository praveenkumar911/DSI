const express = require('express');
const router = express.Router();
const { Lesson, Activity, Class, Student } = require('../models/model');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token.' });
        }
        req.mailId = decoded.mail; // Attach the decoded email to the request object
        next();
    });
};

// Create a new lesson
// In your backend route, modify: 
router.post('/newLesson', verifyToken, async (req, res) => {
    try {
        const { lesson_name, classId, skills, lessonDate, lessonDuration } = req.body;

        // Find class by standard instead of ID
        const classExists = await Class.findOne({ standard: classId });
        if (!classExists) {
            return res.status(404).json({ message: 'Class not found.' });
        }

        // Create lesson using the actual class ID from the found class
        const lesson = new Lesson({
            mailId: req.mailId,
            lesson_name,
            classId: classExists._id, // Use the actual MongoDB ID
            skills,
            lessonDate,
            lessonDuration,
        });

        // Save and return
        const savedLesson = await lesson.save();
        res.status(201).json({
            message: 'Lesson created successfully.',
            lesson: savedLesson,
        });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Get all lessons for a fellow (by email)
router.get('/getLessons', verifyToken, async (req, res) => {
    try {
        console.log('Fetching lessons for mailId:', req.mailId); // Log the mailId

        // Find all lessons for this user's email
        const lessons = await Lesson.find({ mailId: req.mailId });

        if (!lessons || lessons.length === 0) {
            console.log('No lessons found for mailId:', req.mailId); // Log if no lessons are found
            return res.status(200).json({ lessons: [] }); // Return empty array instead of 404
        }

        // Create an array to hold the enhanced lesson data
        const enhancedLessons = [];

        // Process each lesson to add student data
        for (const lesson of lessons) {
            console.log('Processing lesson:', lesson._id); // Log the lesson ID

            // Get the class information
            const classInfo = await Class.findById(lesson.classId);

            if (!classInfo) {
                console.log('Class not found for lesson:', lesson._id); // Log if class is not found
                enhancedLessons.push({
                    ...lesson.toObject(),
                    students: []
                });
                continue;
            }

            // Get all students for this class
            const students = await Student.find({ classId: lesson.classId });
            console.log('Found students for class:', classInfo._id, students.length); // Log the number of students

            // Add the lesson with its students to our result array
            enhancedLessons.push({
                ...lesson.toObject(),
                students: students.map(student => ({
                    ...student.toObject(),
                    activity: lesson.lesson_name, // Add the activity name to each student
                    activities: [lesson.lesson_name] // Add a list of activities (can be expanded if multiple activities exist)
                }))
            });
        }

        res.status(200).json({ lessons: enhancedLessons });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Update lesson progress
router.put('/updateLessonProgress/:id', verifyToken, async (req, res) => {
    try {
        const { progress } = req.body;
        const lessonId = req.params.id;

        if (typeof progress !== 'boolean') {
            return res.status(400).json({ message: 'Progress must be a boolean value.' });
        }

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }

        lesson.progress = progress;
        await lesson.save();

        res.status(200).json({
            message: 'Lesson progress updated successfully.',
            lesson,
        });
    } catch (error) {
        console.error('Error updating lesson progress:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Add suggested activities to a lesson
router.post('/addSuggestedActivities/:lessonId', verifyToken, async (req, res) => {
    try {
        const { activities } = req.body;
        const lessonId = req.params.lessonId;

        if (!Array.isArray(activities) || activities.length === 0) {
            return res.status(400).json({ message: 'Activities must be a non-empty array.' });
        }

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }

        // Create and save activities
        const createdActivities = [];
        for (const activity of activities) {
            const { activityName, activityDescription, activityProcedure } = activity;

            if (!activityName || !activityDescription || !activityProcedure) {
                return res.status(400).json({ message: 'Each activity must have a name, description, and procedure.' });
            }

            const newActivity = new Activity({
                activityName,
                activityDescription,
                activityProcedure,
            });

            const savedActivity = await newActivity.save();
            createdActivities.push(savedActivity._id);
        }

        // Add activities to the lesson
        lesson.suggestedActivities.push(...createdActivities);
        await lesson.save();

        res.status(201).json({
            message: 'Activities added to lesson successfully.',
            lesson,
        });
    } catch (error) {
        console.error('Error adding suggested activities:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Update selected activity for a lesson
router.put('/updateSelectedActivity/:lessonId', verifyToken, async (req, res) => {
    try {
        const { activityId } = req.body;
        const lessonId = req.params.lessonId;

        if (!activityId) {
            return res.status(400).json({ message: 'Activity ID is required.' });
        }

        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }

        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        lesson.selectedActivityId = activityId;
        await lesson.save();

        res.status(200).json({
            message: 'Selected activity updated successfully.',
            lesson,
        });
    } catch (error) {
        console.error('Error updating selected activity:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

// Fetch skills (dummy data or from a config file)
router.get('/getSkills', async (req, res) => {
    try {
        const skills = ['JavaScript', 'HTML', 'CSS', 'Python', 'React']; // Replace with actual skills data
        res.status(200).json({ skills });
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
});

module.exports = router;