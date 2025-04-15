const express = require('express');
const router = express.Router();
const { saveStudentProgress } = require('../controllers/studentProgressController');

router.post('/saveStudentProgress', saveStudentProgress);

module.exports = router; 