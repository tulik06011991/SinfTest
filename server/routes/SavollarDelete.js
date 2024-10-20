const express = require('express');
const router = express.Router();
const { deleteAllQuestions } = require('../admin/SavollarDelete');

// Barcha savollarni o'chirish uchun route
router.delete('/questions/subject/:subjectId', deleteAllQuestions);

module.exports = router;
