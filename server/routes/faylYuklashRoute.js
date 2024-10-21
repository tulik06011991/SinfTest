const express = require('express');
const router = express.Router();
const quizController = require('../faylController/faylYuklashTes');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), quizController.extractAndSave);

module.exports = router;
