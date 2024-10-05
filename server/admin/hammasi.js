
// Admin tokenini tekshirish funksiyasi
const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model
const User = require('../Model/auth'); // Foydalanuvchilar model
const Subject = require('../Model/Fanlar');
const Option = require('../Model/hammasi'); // Variantlar model

// Admin tokenini tekshirish funksiyasi
const verifyAdminToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Token topilmadi.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Sizda ushbu amalni bajarish huquqi yo\'q.' });
        }
        req.userId = decoded.id; // Admin ID
        next();
    });
};

// Fan bo'yicha ma'lumotlarni olish va natijalarni hisoblash
// Fan bo'yicha ma'lumotlarni olish va natijalarni hisoblash
const getSubjectDetails = async (req, res) => {
    try {
        const subjectId = req.params.subjectId;

        // Fan ID orqali savollar va variantlarni olish
        const questions = await Question.find({ subject: subjectId }).populate('options');

        // Foydalanuvchilarning javoblari
        const answers = await Answer.find({ subjectId })
            .populate('userId', 'name') // Foydalanuvchi ismini olish
            .populate('questionId') // Savollarni olish
            .populate('optionId'); // Variantlarni olish

        // Har bir foydalanuvchining to'g'ri javoblarini hisoblash
        const userResults = [];

        // Har bir foydalanuvchining natijalarini olish
        const users = await User.find();
        
        for (const user of users) {
            // Foydalanuvchining bergan javoblari
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === user._id.toString());

            let correctAnswersCount = 0;

            // Har bir javobni tekshirish
            for (const answer of userAnswers) {
                const option = await Option.findById(answer.optionId); // Variantni olish
                if (option && option.isCorrect) {
                    correctAnswersCount++; // To'g'ri javoblar soni
                }
            }

            // Umumiy savollar soni va foiz hisoblash
            const totalQuestions = questions.length;
            const correctPercentage = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;

            userResults.push({
                user: user.name,
                totalQuestions,
                correctAnswersCount,
                correctPercentage: correctPercentage.toFixed(2), // Foizni yaxlitlash
            });
        }

        // Natijalar va savollarni qaytarish
        res.status(200).json({
            questions,
            userResults, // Har bir foydalanuvchining natijalari
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ma\'lumotlarni olishda xatolik yuz berdi.' });
    }
};


module.exports = {
    verifyAdminToken,
    getSubjectDetails,
};

