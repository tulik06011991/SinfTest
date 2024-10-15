const Question = require('../Model/questionModel'); // Savollar modelini chaqiramiz

// Ma'lum bir fan bo'yicha savollarni olish
exports.getQuestionsBySubject = async (req, res) => {
    try {
        const { subject } = req.params; // URL'dan subject olamiz

        // Savollarni fan bo'yicha topamiz
        const questions = await Question.find({ subject });

        // Agar savollar topilmasa
        if (!questions.length) {
            return res.status(404).json({ message: 'Savollar topilmadi!' });
        }

        // Savollarni muvaffaqiyatli qaytarish
        res.status(200).json(questions);
    } catch (error) {
        console.error('Savollarni olishda xatolik yuz berdi:', error);
        res.status(500).json({ error: 'Savollarni olishda xato yuz berdi!' });
    }
};
