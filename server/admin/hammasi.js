const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model
const Subject = require('../Model/Fanlar');

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
        const answers = await Answer.find({ subjectId })
            .populate('userId', 'name') // Foydalanuvchining ismi
            .populate({
                path: 'questionId',
                populate: {
                    path: 'subject', // Savolning fani haqida ham ma'lumot olamiz
                    model: 'Subject'
                }
            });

        // Agar javoblar topilmasa, `Question` modelidan savollarni olish
        if (!answers.length) {
            const questions = await Question.find({ subject: subjectId }) // Fanni bo'yicha savollarni olish
                .populate('subject'); // Fanning ma'lumotlari

            if (!questions.length) {
                return res.status(404).json({ message: 'Subject bo\'yicha savollar topilmadi.' });
            }

            // Savollarni variantlari bilan birga qaytarish
            const questionsWithOptions = questions.map((question) => ({
                questionId: question._id,
                questionText: question.question, // Savol matni
                options: question.options, // Variantlar
                subject: question.subject, // Fanning ma'lumotlari
                createdAt: question.createdAt // Savolning yuklangan sanasi
            }));

            return res.status(200).json({
                subjectId,
                userResults: [], // Foydalanuvchi natijalari yo'q
                questionsWithOptions // Faqat savollar va ularning variantlari qaytariladi
            });
        }

        // Har bir foydalanuvchining natijalarini saqlash uchun array
        const userResults = [];
        const allQuestionsWithOptions = {}; // Barcha savollarni unique qilish uchun object ko'rinishida saqlaymiz

        // Foydalanuvchilarni takrorlanmas qilib olish (unique)
        const users = [...new Set(answers.map(answer => answer.userId?._id.toString()))]; // Foydalanuvchilarning unique ro'yxati

        // Har bir foydalanuvchining javoblarini hisoblash
        for (let userId of users) {
            const userAnswers = answers.filter(answer => answer.userId?._id.toString() === userId);

            let correctAnswersCount = 0;

            for (let userAnswer of userAnswers) {
                const question = userAnswer.questionId;
                const selectedOption = userAnswer.selectedOption;

                // Null qiymatlar uchun tekshirish
                if (!question || !userAnswer.userId) continue; // Savol yoki foydalanuvchi mavjud bo'lmasa, davomini o'tkazib yuborish

                const correctAnswer = question.correctAnswer;

                // Agar savol ID allaqachon objectga qo'shilmagan bo'lsa, uni qo'shamiz
                if (!allQuestionsWithOptions[question._id]) {
                    allQuestionsWithOptions[question._id] = {
                        questionId: question._id,
                        questionText: question.question,
                        options: question.options,
                        subject: question.subject,
                        createdAt: question.createdAt // Savol yuklangan vaqt
                    };
                }

                // Agar tanlangan variant to'g'ri javobga mos kelsa, ball qo'shamiz
                if (selectedOption === correctAnswer) {
                    correctAnswersCount++;
                }
            }

            const totalQuestions = userAnswers.length;
            const correctPercentage = totalQuestions > 0 ? ((correctAnswersCount / totalQuestions) * 100).toFixed(2) : 0;

            userResults.push({
                userId: userAnswers[0]?.userId?._id, // Tekshiruv qo'shildi
                userName: userAnswers[0]?.userId?.name, // Tekshiruv qo'shildi
                totalQuestions,
                correctAnswersCount,
                correctPercentage,
                answeredAt: userAnswers[0]?.createdAt // Foydalanuvchining javob bergan vaqti
            });
        }

        // Foydalanuvchilarning natijalari va savollarni qaytarish
        res.status(200).json({
            subjectId,
            userResults, // Foydalanuvchilar natijalari
            questionsWithOptions: Object.values(allQuestionsWithOptions) // Savollar va ularning variantlari unique ko'rinishda
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ma\'lumotlarni olishda xatolik yuz berdi.' });
    }
};

const deleteQuestion = async (req, res) => {
    const { questionId } = req.params;

    try {
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Savol topilmadi.' });
        }

        res.status(200).json({ message: 'Savol muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Savolni o\'chirishda xatolik yuz berdi.' });
    }
};

const deleteResult = async (req, res) => {
    const { id } = req.params; // userId ni req.params dan olamiz

    try {
        // Natijani userId bo'yicha o'chirish
        const result = await Answer.deleteMany({ userId: id }); // userId ga tegishli barcha natijalarni o'chiradi

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Natija topilmadi.' });
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
