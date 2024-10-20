const Question = require('../Model/questionModel'); // Savollar modelini chaqiramiz

 // Sizning modelingiz qayerda bo'lsa, shu joydan kiritasiz

// Savollarni olish funksiyasi
const getQuestionsBySubject  = async (req, res) => {
  try {
    const fanId = req.params.subject;
    console.log(fanId)
     // URL'dan kelyapti deb hisoblaymiz, masalan: /questions/:fanId

    // fanId ga mos barcha savollarni olish
    const questions = await Question.find({ fanId: fanId })
      .select('questionText options createdAt') // Faqat kerakli maydonlarni olamiz
      .exec();

    if (!questions || questions.length === 0) {
      return res.status(404).json({ message: 'Savollar topilmadi' });
    }

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Xatolik yuz berdi', error: error.message });
  }
};

module.exports = {
  getQuestionsBySubject 
};

