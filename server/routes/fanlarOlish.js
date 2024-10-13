const express = require('express');
const router = express.Router();
const { getSubjects, getSubjectId } = require('../admin/FanlarniOlish');

// Barcha fanlarni yoki adminId bo'yicha fanlarni olish
// router.get('/subjects', getSubjects);

router.post('/subjects', getSubjects);
router.get('/subjects/:fan', getSubjectId);// adminId ixtiyoriy

module.exports = router;
