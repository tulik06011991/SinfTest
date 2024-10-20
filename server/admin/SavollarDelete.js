const Question = require('../Model/questionModel'); // Question modelini import qilamiz

// Barcha savollarni o'chirish funksiyasi
const deleteAllQuestions = async (req, res) => {
  try {
    // Fan ID sini olish
    const { subjectId } = req.params; // URL dan fan ID sini olish

    // Agar fan ID mavjud bo'lmasa, xato qaytaramiz
    if (!subjectId) {
      return res.status(400).json({ message: 'Fan ID berilmagan.' });
    }

    // Fan ID ga mos keluvchi barcha savollarni o'chirish
    const result = await Question.deleteMany({ fanId: subjectId });

    // Agar hech qanday savol o'chirilmagan bo'lsa, xabar beramiz
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'O\'chiriladigan savollar topilmadi.' });
    }

    // O'chirish muvaffaqiyatli bo'lsa, natijani qaytaramiz
    return res.status(200).json({ message: 'Barcha savollar muvaffaqiyatli o\'chirildi.', deletedCount: result.deletedCount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Serverda xatolik yuz berdi.' });
  }
};

module.exports = { deleteAllQuestions };
