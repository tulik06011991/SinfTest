const Question = require('../Model/questionModel'); // Savollar modelini chaqiramiz

// Ma'lum bir fan bo'yicha savollarni olish
exports.getQuestionsBySubject = async (req, res) => {
    try {
        const { fanId } = req.params; // URL'dan fanId olamiz
        console.log(fanId);

        // fanId bo'yicha savollarni qidiramiz
        const questions = await Question.find({ fanId });

        // Agar savollar topilmasa
        if (!questions.length) {
            return res.status(404).json({ message: 'Bu fanga oid savollar topilmadi!' });
        }

        // Agar savollar mavjud bo'lsa, ularni qaytarish
        res.status(200).json(questions);
    } catch (error) {
        console.error('Savollarni olishda xatolik yuz berdi:', error);
        res.status(500).json({ error: 'Savollarni olishda xato yuz berdi!' });
    }
};
