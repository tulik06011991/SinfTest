const express = require('express');
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const fs = require('fs');



// Multer konfiguratsiyasi - yuklangan fayllarni saqlash
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // fayl nomini unique qilish
    }
});

const upload = multer({ storage: storage });

// Fayldan savollar va variantlarni extract qilish
const parseWordFile = async (filePath) => {
    try {
        const data = await mammoth.extractRawText({ path: filePath });
        const content = data.value; // Word faylidagi matn
        const questions = extractQuestions(content);
        return questions;
    } catch (error) {
        console.error('Error parsing Word file:', error);
        throw error;
    }
};

// Savollarni va variantlarni olish
const extractQuestions = (content) => {
    const lines = content.split('\n');
    let questions = [];
    let currentQuestion = {};
    
    lines.forEach((line) => {
        // Savolni olish
        const questionMatch = line.match(/^\d+\./); // Raqam va nuqta bilan savollarni olish
        if (questionMatch) {
            if (currentQuestion.question) {
                questions.push(currentQuestion);
            }
            currentQuestion = {
                question: line.trim(),
                options: [],
                correctAnswer: null
            };
        }

        // Variantlarni olish
        const optionMatch = line.match(/^[A-D][).]/); // A) B) C) D) kabi variantlarni olish
        if (optionMatch) {
            const isCorrect = line.trim().startsWith('.'); // To'g'ri javobni aniqlash
            const optionText = line.replace(/^[A-D][).]\s*/, '').trim();
            currentQuestion.options.push(optionText);
            if (isCorrect) {
                currentQuestion.correctAnswer = optionText; // To'g'ri javob
            }
        }
    });

    // Oxirgi savolni qo'shish
    if (currentQuestion.question) {
        questions.push(currentQuestion);
    }

    return questions;
};

// API route - Word faylni yuklash va savollarni extract qilish
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const questions = await parseWordFile(filePath);
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: 'Error extracting questions' });
    }
});

// Serverni ishga tushirish
