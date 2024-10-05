const jwt = require('jsonwebtoken');
const Answer = require('../Model/Javoblar'); // Foydalanuvchilar natijalari model
const Question = require('../Model/questionModel'); // Savollar model
const User = require('../Model/auth'); // Foydalanuvchilar model
const Subject = require('../Model/Fanlar');
const options = require('../Model/hammasi') // Fanlar model

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

// Fan bo'yicha ma'lumotlarni olish
const getSubjectDetails = async (req, res) => {
    try {
        const subjectId = req.params.subjectId;

        // Fan ID orqali savollar va foydalanuvchilar natijalarini olish
        const questions = await Question.find({ subject: subjectId }).populate('options');
        const answers = await Answer.find({ subjectId })
            .populate('userId', 'name') // Foydalanuvchini ko'rsatish uchun
            .populate('questionId') // Savolni ko'rsatish uchun
            .populate('optionId'); // Variantni ko'rsatish uchun

        // Foydalanuvchilar ro'yxatini olish
        const users = await User.find();

        res.status(200).json({
            questions,
            answers,
            users,
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
