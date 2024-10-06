const express = require('express');
const { verifyAdminToken, getSubjectDetails, downloadUserResultsPDF } = require('../admin/hammasi');
const router = express.Router();

// Admin tomonidan fan bo'yicha ma'lumotlarni olish
router.get('/subjects/:subjectId/details', verifyAdminToken, getSubjectDetails);
router.get('/subjects/:subjectId/results/pdf', verifyAdminToken, downloadUserResultsPDF);


module.exports = router;
