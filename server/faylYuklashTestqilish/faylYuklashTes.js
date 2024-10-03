const express = require('express');
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const mongoose = require('mongoose');
const Question = require('./questionModel'); // Savollar modeli

const app = express();

// MongoDB ga ulanish
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/quizDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

connectDB();

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

// Fayldan savollar va variantlarni extract qilish va saqlash
const parseWordFile = async (filePath) => {
    try {
        const data = await mammoth.extractRawText({ path: filePath });
        const content = data.value;
        const questions = extractQuestions(content);

        // MongoDB ga savollarni saqlash
        for (let questionData of questions) {
            const newQuestion = new Question({
                question: questionData.question,
                options: questionData.options.map(option => ({
                    text: option,
                    isCorrect: option === questionData.correctAnswer
                })),
                correctAnswer: questionData.correctAnswer
            });
            await newQuestion.save(); // Savollarni saqlash
        }

        return questions;
    } catch (error) {
        console.error('Error parsing Word file:', error);
        throw error;
    }
};

// Savollar va variantlarni olish funksiyasi
const extractQuestions = (content) => {
    const lines = content.split('\n');
    let questions = [];
    let currentQuestion = {};

    lines.forEach((line) => {
        // Savolni olish
        const questionMatch = line.match(/^\d+\./);
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
        const optionMatch = line.match(/^[A-D][).]/);
        if (optionMatch) {
            const isCorrect = line.trim().startsWith('.');
            const optionText = line.replace(/^[A-D][).]\s*/, '').trim();
            currentQuestion.options.push(optionText);
            if (isCorrect) {
                currentQuestion.correctAnswer = optionText;
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
