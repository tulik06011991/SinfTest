const path = require('path');
const mammoth = require('mammoth');
const Question = require('../Model/questionModel');

// Fayldan savollar va variantlarni extract qilish va saqlash
const parseWordFile = async (filePath) => {
    try {
        const data = await mammoth.extractRawText({ path: filePath });
        const content = data.value;
        const questions = extractQuestions(content);
        console.log(data)
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
        const questionMatch = line.match(/^\d+\./); // Savol raqam bilan boshlanadi, masalan "1."
        if (questionMatch) {
            if (currentQuestion.question) {
                // Agar avvalgi savolda to'g'ri javob bo'lmasa, u holda savolni tashlab ketmaslik uchun fallback qiymat tayinlaymiz
                if (!currentQuestion.correctAnswer) {
                    currentQuestion.correctAnswer = currentQuestion.options[0]; // Birinchi variantni to'g'ri deb belgilash
                }
                questions.push(currentQuestion);
            }
            currentQuestion = {
                question: line.trim(), // Savolni trim bilan tozalaymiz
                options: [],
                correctAnswer: null
            };
        }

        // Variantlarni olish
        const optionMatch = line.match(/^[A-D][).]/); // Variantlar "A)", "B)", "C)" yoki "A." shaklida keladi
        if (optionMatch) {
            const optionText = line.replace(/^[A-D][).]\s*/, '').trim(); // Variant matnini olamiz
            const isCorrect = optionText.startsWith('.'); // Agar nuqta bilan boshlansa, to'g'ri javob
            const cleanOptionText = isCorrect ? optionText.slice(1).trim() : optionText; // Nuqtani olib tashlaymiz

            currentQuestion.options.push(cleanOptionText); // Variantni qo'shamiz
            if (isCorrect) {
                currentQuestion.correctAnswer = cleanOptionText; // Agar to'g'ri bo'lsa, javob sifatida belgilanadi
            }
        }
    });

    // Oxirgi savolni qo'shish, to'g'ri javob aniqlanmagan bo'lsa, fallback qiymat tayinlaymiz
    if (currentQuestion.question) {
        if (!currentQuestion.correctAnswer) {
            currentQuestion.correctAnswer = currentQuestion.options[0]; // Birinchi variantni to'g'ri deb belgilash
        }
        questions.push(currentQuestion);
    }

    return questions;
};



// Fayl yuklash va savollarni extract qilish
const uploadQuestions = async (req, res) => {
    try {
        const filePath = req.file.path;
        const questions = await parseWordFile(filePath);
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: 'Error extracting questions' });
    }
};

module.exports = {
    uploadQuestions
};
