const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadQuestions } = require('../controllers/questionController');

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Word fayl yuklash va savollarni extract qilish
router.post('/upload', upload.single('file'), uploadQuestions);

module.exports = router;
