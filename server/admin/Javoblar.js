const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar');
const Question = require('../Model/questionModel');

// Javoblarni qabul qiladigan funksiya
const submitAnswers = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]; // Bearer tokenni olish
    if (!token) {
        return res.status(401).json({ message: 'Token mavjud emas' });
    }

    try {
        // Tokenni dekodlash va foydalanuvchini olish
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id; // Foydalanuvchi ID'si token ichidan

        const { subjectId, answers } = req.body; // Fan ID va javoblar
        const savedAnswers = [];

        // Javoblarni qayta ishlash va saqlash
        for (let questionId in answers) {
            const optionText = answers[questionId]; // Tanlangan variant texti
            const question = await Question.findById(questionId); // Savolni bazadan olish

            if (question) {
                // Tanlangan variantning ID'sini olish
                const selectedOption = question.options.find(option => option.text === optionText);
                const isCorrect = selectedOption.isCorrect; // Variant to'g'ri yoki noto'g'ri

                // Javobni saqlash
                const answer = new Answer({
                    userId,
                    subjectId,
                    questionId,
                    optionId: selectedOption._id,
                    isCorrect
                });
                await answer.save();
                savedAnswers.push(answer);
            }
        }

        return res.status(200).json({ message: 'Javoblar saqlandi', answers: savedAnswers });
    } catch (error) {
        console.error('Javoblarni saqlashda xato:', error);
        return res.status(500).json({ message: 'Xatolik yuz berdi' });
    }
};

module.exports = { submitAnswers };
