const express = require('express');
const multer = require('multer');
const { extractQuestionsFromWord } = require('../faylController/faylYuklashTes');
const path = require('path');


const router = express.Router();

// Fayllar uchun multer konfiguratsiyasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Faylni vaqtinchalik saqlash joyi
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Fayl nomi
  }
});

const upload = multer({ storage });

// Word faylni yuklash va savollarni chiqarish marshruti
router.post('/upload', upload.single('file'), extractQuestionsFromWord);

module.exports = router;
