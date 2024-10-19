const express = require('express');
const router = express.Router();
const { getSubjects, getSubjectId, getAllSubjects } = require('../admin/FanlarniOlish');

// Barcha fanlarni yoki adminId bo'yicha fanlarni olish
// router.get('/subjects', getSubjects);

router.get('/subjects/:admin', getSubjects);
router.get('/subjects/:fan', getSubjectId);
router.get('/subjectlar', getAllSubjects);// adminId ixtiyoriy

module.exports = router;
