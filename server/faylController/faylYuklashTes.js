const path = require('path');
const mammoth = require('mammoth');
const Question = require('../Model/questionModel');

// Fayldan savollar va variantlarni extract qilish va saqlash
const parseWordFile = async (filePath, subject) => {
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
                correctAnswer: questionData.correctAnswer,
                subject // Fan nomini kiritamiz
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
    const lines = content.split('\n'); // Faylni qatorlar bo'yicha bo'lamiz
    let questions = [];
    let currentQuestion = {}; // Hozirgi savol

    lines.forEach((line) => {
        // Savolni olish: savol raqami bilan boshlanadi, masalan "1."
        const questionMatch = line.match(/^\d+\./);
        if (questionMatch) {
            // Agar oldingi savol mavjud bo'lsa, uni savollar ro'yxatiga qo'shamiz
            if (currentQuestion.question) {
                if (!currentQuestion.correctAnswer) {
                    // Agar to'g'ri javob aniqlanmagan bo'lsa, birinchi variantni tanlaymiz
                    currentQuestion.correctAnswer = currentQuestion.options[0];
                }
                questions.push(currentQuestion);
            }
            // Yangi savolni boshlash
            currentQuestion = {
                question: line.trim(), // Savol matnini tozalaymiz
                options: [], // Variantlar ro'yxati
                correctAnswer: null // To'g'ri javobni aniqlash
            };
        }

        // Variantlarni olish: "A)", "B)", "C)", "A.", "B." shaklida keladi yoki oldida nuqta bilan boshlanishi mumkin
        const optionMatch = line.match(/^[A-D][).]|\.[A-D][).]?/);
        if (optionMatch) {
            // Variant matnini olish
            let optionText = line.replace(/^[A-D][).]\s*|\.[A-D][).]?\s*/, '').trim();

            // Agar variant oldida nuqta bilan boshlansa, to'g'ri javob bo'ladi
            const isCorrect = line.trim().startsWith('.');

            // Agar to'g'ri variant bo'lsa, uni belgiliymiz
            if (isCorrect) {
                currentQuestion.correctAnswer = optionText; // To'g'ri javobni belgilaymiz
            }

            // Variantni qo'shamiz
            currentQuestion.options.push(optionText);
        }
    });

    // Oxirgi savolni qo'shish, to'g'ri javob aniqlanmagan bo'lsa, birinchi variantni tanlaymiz
    if (currentQuestion.question) {
        if (!currentQuestion.correctAnswer) {
            currentQuestion.correctAnswer = currentQuestion.options[0]; // Birinchi variantni to'g'ri deb belgilaymiz
        }
        questions.push(currentQuestion);
    }

    return questions; // Barcha savollarni qaytaramiz
};

// Fayl yuklash va savollarni extract qilish
const uploadQuestions = async (req, res) => {
    try {
        const filePath = req.file.path;
        const { subject } = req.body; // Fan nomini request body'dan olamiz
        const questions = await parseWordFile(filePath, subject);
        res.json({ questions });
    } catch (error) {
        res.status(500).json({ message: 'Error extracting questions' });
    }
};

module.exports = {
    uploadQuestions
};
