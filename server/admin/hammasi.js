


const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model
const User = require('../Model/auth'); // Foydalanuvchilar model
const Subject = require('../Model/Fanlar');
 const Option = require('../Model/hammasi');
 const Results = require('../Model/pdf');


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

        // Har bir foydalanuvchining natijalarini olish
        const users = await User.find();

        // Natijalarni saqlash
        const userResults = [];

        for (const user of users) {
            // Foydalanuvchining bergan javoblari
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === user._id.toString());

            // To'g'ri javoblar sonini aniqlash
            const correctAnswersCount = userAnswers.filter(answer => answer.isCorrect).length;

            // Umumiy savollar soni va foiz hisoblash
            const totalQuestions = questions.length;
            const correctPercentage = totalQuestions > 0 ? (correctAnswersCount / totalQuestions) * 100 : 0;

            // Natijalarni `Results` modeliga yozish
            const result = new Results({
                userId: user._id,
                subjectId: subjectId,
                correctAnswersCount,
                totalQuestions,
                correctPercentage: correctPercentage.toFixed(2) // Foizni yaxlitlash
            });
            await result.save(); // Saqlash

            userResults.push({
                userId: user._id,
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

const deleteQuestion = async (req, res) => {
    const  {questionId}  = req.params;
console.log(questionId)

    try {
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Savol topilmadi.' });
        }

        // Savolga tegishli javoblarni o'chirish (agar kerak bo'lsa)
        await Answer.deleteMany({ questionId });

        res.status(200).json({ message: 'Savol muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Savolni o\'chirishda xatolik yuz berdi.' });
    }
}; 


const deleteResult = async (req, res) => {
    const data = req.body;

    try {
        const result = await Results.findByIdAndDelete(data);
        if (!result) {
            return res.status(404).json({ message: 'Natija topilmadi.' });
        }

        res.status(200).json({ message: 'Natija muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Natijani o\'chirishda xatolik yuz berdi.' });
    }
};

module.exports = {
    verifyAdminToken,
    getSubjectDetails,
    deleteQuestion,
    deleteResult,
};

























