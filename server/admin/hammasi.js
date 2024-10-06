const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model
const User = require('../Model/auth'); // Foydalanuvchilar model
const Subject = require('../Model/Fanlar');
const Option = require('../Model/hammasi'); // Variantlar model

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const pdf = new PDFDocument();
 // pdfkit kutubxonasini import qilish


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

        // Har bir foydalanuvchining to'g'ri javoblarini hisoblash
        const userResults = [];

        // Har bir foydalanuvchining natijalarini olish
        const users = await User.find();

        for (const user of users) {
            // Foydalanuvchining bergan javoblari
            const userAnswers = answers.filter(answer => answer.userId._id.toString() === user._id.toString());

            // To'g'ri javoblar sonini aniqlash
            const correctAnswersCount = userAnswers.filter(answer => answer.isCorrect).length;

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

// Foydalanuvchilar natijalarini PDF formatida yuklab olish
const downloadUserResultsPDF = async (req, res) => {
    try {
        const subjectId = req.params.subjectId;

        const answers = await Answer.find({ subjectId: subjectId })
            .populate('userId', 'name')
            .populate('questionId')
            .populate('optionId');

        const doc = new pdf();
        const filePath = `results-${subjectId}.pdf`;
        doc.pipe(fs.createWriteStream(filePath));

        // PDFga yozish
        doc.fontSize(20).text(`Natijalar - Fan ID: ${subjectId}`, { align: 'center' });
        doc.moveDown();

        answers.forEach(answer => {
            doc.fontSize(12).text(`Foydalanuvchi: ${answer.userId.name}`);
            doc.text(`Savol: ${answer.questionId.text}`);
            doc.text(`Variant: ${answer.optionId.text}`);
            doc.text(`To'g'ri: ${answer.isCorrect ? 'Ha' : 'Yo\'q'}`);
            doc.moveDown();
        });

        doc.end();

        // PDFni yuklash
        res.download(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('PDFni yuklashda xatolik yuz berdi.');
            }
            // PDF faylini serverdan o'chirish
            fs.unlink(filePath, (err) => {
                if (err) console.error(err);
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Natijalarni PDF formatida olishda xatolik yuz berdi.' });
    }
};

module.exports = {
    verifyAdminToken,
    getSubjectDetails,
    downloadUserResultsPDF, // Yangi funksiya
};
