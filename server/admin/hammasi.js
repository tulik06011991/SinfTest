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
        const subjectId = req.params.subjectId; // URL'dan subjectId olindi

        // subjectId bo'yicha foydalanuvchilarning javoblarini olish
        const answers = await Answer.find({ subjectId }) // Faqat subjectId bo'yicha javoblar olindi
            .populate('userId', 'name') // Foydalanuvchining ismi
            .populate({
                path: 'questionId',
                populate: {
                    path: 'subject', // Savolning fani haqida ham ma'lumot olamiz
                    model: 'Subject'
                }
            });

        // Agar javoblar topilmasa
        if (!answers || answers.length === 0) {
            return res.status(404).json({ message: 'Subject bo\'yicha javoblar topilmadi.' });
        }

        const userResults = [];
        const allQuestionsWithOptions = [];
        const addedQuestionIds = new Set();

        const users = [...new Set(answers.map(answer => answer.userId._id.toString()))];

        for (let userId of users) {
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === userId);

            let correctAnswersCount = 0;

            for (let userAnswer of userAnswers) {
                const question = userAnswer.questionId;
                const selectedOption = userAnswer.selectedOption;
                const correctAnswer = question.correctAnswer;

                // Tekshirish: agar savol bo'lmasa xatolikni qaytarmaslik uchun
                if (!question) {
                    console.warn('Savol topilmadi:', userAnswer.questionId);
                    continue; // Savol topilmasa, davomini bajaramiz
                }

                if (!addedQuestionIds.has(question._id.toString())) {
                    allQuestionsWithOptions.push({
                        questionId: question._id,
                        questionText: question.question,
                        options: question.options,
                        selectedOption: selectedOption,
                        correctAnswer: correctAnswer,
                        subject: question.subject,
                        userId: userAnswer.userId._id,
                        userName: userAnswer.userId.name
                    });
                    addedQuestionIds.add(question._id.toString());
                }

                if (selectedOption === correctAnswer) {
                    correctAnswersCount++;
                }
            }

            const totalQuestions = userAnswers.length;
            const correctPercentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0;

            userResults.push({
                userId: userAnswers[0]?.userId._id,
                userName: userAnswers[0]?.userId.name,
                totalQuestions,
                correctAnswersCount,
                correctPercentage
            });
        }

        res.status(200).json({
            subjectId,
            userResults,
            questionsWithOptions: allQuestionsWithOptions
        });

    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'Ma\'lumotlarni olishda xatolik yuz berdi.' });
    }
};

// Barcha savollarni o'chirish controlleri
const deleteQuestion =async (req, res) => {
    try {
        const { id } = req.params; // URL'dan ID ni olish
        const deletedQuestion = await Question.findByIdAndDelete(id); // ID bo'yicha savolni o'chirish

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' }); // Agar savol topilmasa
        }

        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ message: 'Failed to delete the question' });
    }
};

// Foydalanuvchiga tegishli natijalarni o'chirish
const deleteResult = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await Answer.deleteMany({ userId: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Natija topilmadi.' });
        }

        res.status(200).json({ message: 'Foydalanuvchiga tegishli barcha natijalar muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        // console.error(error);
        res.status(500).json({ message: 'O\'chirishda xatolik yuz berdi.' });
    }
};

module.exports = {
    verifyAdminToken,
    getSubjectDetails,
    deleteQuestion,
    deleteResult,
};
