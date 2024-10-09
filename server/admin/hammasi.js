


const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model

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
        const subjectId = req.params.subjectId;  // URL'dan subjectId olindi
        console.log(subjectId);

        // subjectId bo'yicha foydalanuvchilarning javoblarini olish
        const answers = await Answer.find({ subjectId })  // Faqat subjectId bo'yicha javoblar olindi
            .populate('userId', 'name');  // Foydalanuvchining ismini olish

        // Agar javoblar topilmasa
        if (!answers.length) {
            return res.status(404).json({ message: 'Subject bo\'yicha javoblar topilmadi.' });
        }

        // Har bir foydalanuvchining natijalarini saqlash uchun array
        const userResults = [];

        // Foydalanuvchilarni takrorlanmas qilib olish (unique)
        const users = [...new Set(answers.map(answer => answer.userId._id.toString()))]; // Foydalanuvchilarning unique ro'yxati

        // Savollarni subjectId bo'yicha olish
        const questions = await Question.find({ subject: subjectId });

        // Har bir foydalanuvchining javoblarini hisoblash
        for (let userId of users) {
            // Shu foydalanuvchining subjectId bo'yicha barcha javoblarini olish
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === userId);

            // To'g'ri javoblar sonini hisoblash
            const correctAnswersCount = userAnswers.filter(answer => answer.isCorrect).length;

            // Foydalanuvchining ismi
            const user = userAnswers[0]?.userId; // Foydalanuvchining ismi

            // Foydalanuvchi ma'lumotlarini yig'ish
            userResults.push({
                userId: user._id,
                userName: user.name,
                totalQuestions: userAnswers.length, // Foydalanuvchi javob bergan savollar soni
                correctAnswersCount,  // To'g'ri javoblar soni
                correctPercentage: ((correctAnswersCount / userAnswers.length) * 100).toFixed(2),  // To'g'ri javoblar foizi
            });
        }

        // Savollarni va variantlarni JSON formatida qaytarish
        res.status(200).json({
            subjectId,
            userResults,  // Har bir foydalanuvchining natijalari
            questions: questions.map(question => ({
                questionText: question.question,
                options: question.options.map(option => ({
                    text: option.text,
                    isCorrect: option.isCorrect
                })),
                correctAnswer: question.correctAnswer
            }))
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
    const { id } = req.params; // userId ni req.params dan olamiz
    console.log(id);

    try {
        // Natijani userId bo'yicha o'chirish
        const result = await Results.deleteMany({ userId: id }); // userId ga tegishli barcha natijalarni o'chiradi

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Natija topilmadi.' }); // 404 - Not Found, agar o'chiriladigan natija topilmasa
        }

        res.status(200).json({ message: 'Foydalanuvchiga tegishli barcha natijalar muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'O\'chirishda xatolik yuz berdi.' });
    }
};




module.exports = {
    verifyAdminToken,
    getSubjectDetails,
    deleteQuestion,
    deleteResult,
};

























