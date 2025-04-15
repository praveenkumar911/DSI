const express = require('express');
const {
    createClass,
    createStudent,
    getClassesByFellow,
    getStudentsByClass,
    saveStudentScores,
    getStudentsByStandard, // Add this function 
} = require('../controllers/classController');

const router = express.Router();

router.post('/newClass', createClass);
router.post('/newStudent', createStudent);
router.get('/getClassesByFellow', getClassesByFellow);
router.get('/getStudentsByClass/:classId', getStudentsByClass);
router.post('/saveStudentScores', saveStudentScores);

// Add the missing route
router.get('/getStudentsByStandard/:standard', getStudentsByStandard); 

module.exports = router;
