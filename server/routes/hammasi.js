const express = require('express');
const { verifyAdminToken, getSubjectDetails,  } = require('../admin/hammasi');
const {downloadUserResultsPDF} = require('../admin/pdf')
const router = express.Router();

// Admin tomonidan fan bo'yicha ma'lumotlarni olish
router.get('/subjects/:subjectId', verifyAdminToken, getSubjectDetails);





module.exports = router;
