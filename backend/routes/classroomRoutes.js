const express = require('express');
const router = express.Router();
const Classroom = require('../models/model');

// ✅ Add Classroom & Activity 
router.post('/add-classroom', async (req, res) => {
    try {
        const { classroomName, activity } = req.body;
        const classroom = new Classroom({ classroomName, activity, students: [] });
        await classroom.save();
        res.status(201).json({ message: "Classroom added successfully", classroom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get All Classrooms
router.get('/classrooms', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.json(classrooms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Split Students into Teams
router.post('/split-teams', async (req, res) => {
    try {
        const { classroomId, students, activity } = req.body;
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) return res.status(404).json({ error: "Classroom not found" });

        let teams = [];
        while (students.length > 0) {
            teams.push({ teamMembers: students.splice(0, 4), activity });
        }

        classroom.teams = teams;
        await classroom.save();
        res.json({ message: "Teams split successfully", classroom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Mark Activity as Completed
router.put('/mark-completed/:id', async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id);
        if (!classroom) return res.status(404).json({ error: "Classroom not found" });

        classroom.completed = true;
        await classroom.save();
        res.json({ message: "Activity marked as completed", classroom });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
