const express = require('express');
const router = express.Router();
const {  getAllSubjects, getQuestionsBySubject } = require('../faylController/fanlarBazasi');

 // Controllerga mos ravishda yo'lni o'zgartiring

// Fanlarni olish
router.get('/subjectss', getAllSubjects);

// Tanlangan fanning savollarini olish
router.get('/questions/:subjectName', getQuestionsBySubject);

// Barcha savollarni olish


module.exports = router;
