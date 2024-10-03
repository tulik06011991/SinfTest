const Question = require('../Model/questionModel'); // Savollar modeli

// Barcha savollarni olish funksiyasi
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find(); // Barcha savollarni bazadan olamiz
        res.status(200).json(questions); // Savollarni JSON formatda qaytaramiz
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving questions', error });
    }
};

module.exports = {
    getAllQuestions
};
