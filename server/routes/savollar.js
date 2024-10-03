const express = require('express');
const router = express.Router();
const { getAllQuestions } = require('../faylController/Savollar');

// Barcha savollarni olish uchun marshrut
router.get('/questions', getAllQuestions);

module.exports = router;
