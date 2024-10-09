const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Modelga moslashtiring
const Question = require('../Model/questionModel'); // Modelga moslashtiring
require('dotenv').config();

// Javoblarni qabul qiladigan funksiya
const submitAnswers = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer tokenni olish
    if (!token) {
        return res.status(401).json({ message: 'Token mavjud emas' });
    }

    try {
        // Tokenni dekodlash va foydalanuvchini olish
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId; // Foydalanuvchi ID'si token ichidan

        const { subjectId, answers, userName } = req.body; // Fan ID, javoblar va foydalanuvchi nomi
        const savedAnswers = [];
        let correctAnswersCount = 0; // To'g'ri javoblar soni
        const totalQuestions = Object.keys(answers).length; // Umumiy savollar soni

        // Javoblarni qayta ishlash va saqlash
        for (let questionId in answers) {
            const optionText = answers[questionId]; // Tanlangan variant texti
            const question = await Question.findById(questionId); // Savolni bazadan olish

            if (question) {
                // Tanlangan variantning ID'sini olish
                const selectedOption = question.options.find(option => option.text === optionText);
                const isCorrect = selectedOption?.isCorrect; // Variant to'g'ri yoki noto'g'ri

                // Agar javob to'g'ri bo'lsa, hisoblash
                if (isCorrect) {
                    correctAnswersCount++; // To'g'ri javobni sanash
                }

                // Javobni saqlash
                const answer = new Answer({
                    userId,
                    userName, // Foydalanuvchi nomini saqlash
                    subjectId,
                    answers: {
                        [questionId]: optionText, // Savol ID va tanlangan variant
                    }
                });
                await answer.save();
                savedAnswers.push(answer);
            }
        }

        // To'g'ri javoblar foizini hisoblash
        const correctPercentage = (correctAnswersCount / totalQuestions) * 100;

        // Javoblarni qaytarish
        return res.status(200).json({
            message: 'Javoblar saqlandi',
            answers: savedAnswers,
            correctAnswersCount: correctAnswersCount, // To'g'ri javoblar soni
            totalQuestions: totalQuestions, // Umumiy savollar soni
            correctPercentage: correctPercentage.toFixed(2) + '%' // To'g'ri javoblar foizi
        });
    } catch (error) {
        console.error('Javoblarni saqlashda xato:', error);
        return res.status(500).json({ message: 'Xatolik yuz berdi' });
    }
};

module.exports = { submitAnswers };
