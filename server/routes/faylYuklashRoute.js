const express = require('express');
const multer = require('multer');
const path = require('path');
const {uploadQuestions} = require('../faylController/faylYuklashTes'); // To'g'ridan-to'g'ri import
const router = express.Router();

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // unique filename
    }
});

const upload = multer({ storage: storage });


// Word fayl yuklash va savollarni extract qilish
router.post('/uploads', upload.single('file'), uploadQuestions); // Callback sifatida funksiya

module.exports = router;
