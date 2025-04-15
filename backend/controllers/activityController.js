const { Activity, Lesson } = require('../models/model');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const skills = require('../config/skills.json');

const getSkills = async (req, res) => {
    try {
        res.status(200).json({ skills });
    } catch (error) {
        console.error('Error fetching skills:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const updateLessonProgress = async (req, res) => {
    try {
        const { lessonId, progress } = req.body;

        if (!lessonId || !progress) {
            return res.status(400).json({ message: 'Lesson ID and progress are required.' });
        }

        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }

        lesson.progress = progress;

        await lesson.save();

        return res.status(200).json({
            message: 'Lesson progress updated successfully.',
            lesson,
        });
    } catch (error) {
        console.error('Error updating lesson progress:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}


const createLesson = async (req, res) => {
    try {
        const { token, lesson_name, classId, skills, lessonDate, lessonDuration } = req.body;

        console.log('Request body:', req.body); // Log the request body

        let mailId;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            mailId = decoded.mail;
        } catch (err) {
            console.error('Error verifying token:', err);
            return res.status(400).json({ message: 'Invalid token' });
        }

        // Validate request body
        if (!mailId || !lesson_name || !classId || !lessonDate || !lessonDuration) {
            return res.status(400).json({ message: 'mailId, lesson_name, classId, lessonDate, and lessonDuration are required.' });
        }

        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Skills must be a non-empty array of strings' });
        }

        // Create a new lesson document
        const lesson = new Lesson({
            mailId,
            lesson_name,
            classId,
            skills,
            lessonDate,
            lessonDuration
        });

        // Save the document to the database 
        const savedLesson = await lesson.save();

        // Respond with the created lesson
        return res.status(200).json({
            message: 'Lesson created successfully.',
            lesson: savedLesson,
        });
    } catch (error) {
        console.error('Error creating lesson:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
}


const createSuggestedActivities = async (req, res) => {
    try {
        const { activities, lessonId } = req.body;

        // Validate input
        if (!activities || !Array.isArray(activities) || activities.length === 0) {
            return res.status(400).json({ message: 'Activities array is required and cannot be empty.' });
        }

        if (!lessonId) {
            return res.status(400).json({ message: 'Lesson ID is required.' });
        }

        // Check if the lesson exists
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }

        // Create activities and collect their IDs
        const createdActivities = [];
        for (const activity of activities) {
            const { activity_name, description, procedure } = activity;

            if (!activity_name || !description || !procedure ) {
                return res.status(400).json({
                    message: 'Each activity must have a name, description',
                });
            }

            // Create and save the activity
            const newActivity = new Activity({ 
                activityName: activity_name, 
                activityDescription: description, 
                activityProcedure: procedure 
            });
            const savedActivity = await newActivity.save();
            createdActivities.push(savedActivity._id);
        }

        lesson.suggestedActivities.push(...createdActivities);
        lesson.selectedActivityId = createdActivities[0];
        await lesson.save();

        return res.status(200).json({
            message: 'Activities created and lesson updated successfully.',
            activities: createdActivities,
            lesson,
        });
    } catch (error) {
        console.error('Error creating activities and updating lesson:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

const updateSelectedActivity = async (req, res) => {
    try {
        console.log(req.body);
        const { lessonId, activityId } = req.body;

        // Validate input
        if (!lessonId || !activityId) {
            return res.status(400).json({ message: 'Lesson ID and Activity ID are required.' });
        }

        // Check if the lesson exists
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found.' });
        }

        // Check if the activity exists
        const activity = await Activity.findById(activityId);
        if (!activity) {
            return res.status(404).json({ message: 'Activity not found.' });
        }

        // Update the selectedActivity field
        lesson.selectedActivityId = activityId;
        lesson.updatedAt = Date.now();
        await lesson.save();

        // Respond with the updated lesson
        return res.status(200).json({
            message: 'Selected activity updated successfully.',
            lesson,
        });
    } catch (error) {
        console.error('Error updating selected activity:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

// Add Activity
const addActivity = async (req, res) => {
    try {
        const { activityName, activityDescription, skills } = req.body;

        // Validate the request body
        if (!activityName) {
            return res.status(400).json({ message: 'Activity name is required' });
        }

        if (!Array.isArray(skills) || skills.length === 0) {
            return res.status(400).json({ message: 'Skills must be a non-empty array of strings' });
        }

        // Create the activity
        const newActivity = new Activity({
            activityName,
            skills,
        });

        const savedActivity = await newActivity.save();
        res.status(201).json({
            message: 'Activity added successfully',
            activity: savedActivity,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get all activities
const getAllActivities = async (req, res) => {
    try {
        const activities = await Activity.find({}, 'activityName _id'); // Fetch name and ID
        res.status(200).json({
            message: 'Activities fetched successfully',
            activities,
        });
    } catch (error) {
        console.error('Error fetching activities:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Fetch Lesson Plans by Fellow Email (No Authentication)
const getLessonPlans = async (req, res) => {
    try {
        // Fetch mailId from query parameters
        const { token } = req.query;

        const mailId = jwt.verify(token, process.env.JWT_SECRET).mail;

        if (!mailId) {
            return res.status(400).json({ message: 'Mail ID is required.' });
        }

        // Fetch lesson plans associated with this mail ID
        const lessonPlans = await Lesson.find({ mailId })

        if (!lessonPlans || lessonPlans.length === 0) {
            return res.status(404).json({ message: 'No lesson plans found for this email ID.' });
        }

        // Return the lesson plans
        res.status(200).json({ lessonPlans });
    } catch (error) {
        console.error('Error fetching lesson plans:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Function to delete a lesson
const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        await Lesson.findByIdAndDelete(id);
        res.status(200).json({ message: 'Lesson deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting lesson', error });
    }
};

// Function to update a lesson
const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedLesson = await Lesson.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedLesson);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lesson', error });
    }
};

module.exports = { 
    addActivity, 
    getLessonPlans,
    getAllActivities, 
    createLesson, 
    createSuggestedActivities,
    updateSelectedActivity,
    getSkills,
    updateLessonProgress,
    deleteLesson,
    updateLesson
};
