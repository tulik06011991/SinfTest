const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth'); // Word faylni matnga o‘girish uchun
const Question = require('../Model/questionModel');

// Word faylni JSONga o‘girish va savollarni saqlash
const extractQuestionsFromWord = async (req, res) => {
  try {
    // Yuklangan faylni o‘qiymiz
    const filePath = req.file.path;
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;

    const questions = parseQuizData(text); // JSON formatga o‘tkazish funksiyasi
    if (!questions) {
      return res.status(400).json({ error: 'Fayl formatida xatolik mavjud. Iltimos, to\'g\'ri formatda ma\'lumotlar kiriting.' });
    }

    if (questions.length > 60) {
      return res.status(400).json({ error: 'Savollar soni 60 tadan oshmasligi kerak' });
    }

    // Savollar soni va variantlar sonini tekshirish
    let totalOptions = 0;
    questions.forEach(q => {
      totalOptions += q.options.length;
    });
    if (totalOptions > 240) {
      return res.status(400).json({ error: 'Variantlar soni 240 tadan oshmasligi kerak' });
    }

    // `fanId`ni savollarga qo‘shamiz
    const fanId = req.body.fanId;
    if (!fanId) {
      return res.status(400).json({ error: 'Fan ID talab qilinadi' });
    }

    // Savollarni bazaga saqlashdan oldin `fanId` ni qo‘shamiz
    const questionsWithFanId = questions.map(q => ({
      ...q,
      fanId: fanId
    }));

    // Savollarni bazaga saqlash
    const savedQuestions = await Question.insertMany(questionsWithFanId);

    res.status(201).json({ message: 'Savollar muvaffaqiyatli saqlandi', savedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  } finally {
    // Yuklangan faylni o‘chirib tashlaymiz
    fs.unlinkSync(req.file.path);
  }
};

// JSON formatga o‘tkazish funksiyasi
function parseQuizData(text) {
  const lines = text.split('\n');
  let questions = [];
  let currentQuestion = null;

  lines.forEach(line => {
    const questionRegex = /^\d+\..*\?|\d+\..*\.$/;
    const optionRegex = /^[A-D]\).+/;
    const correctOptionRegex = /^\.\s*[A-D]\).+/; // Nuqtadan keyin bo'shliqni ham qabul qilish

    if (questionRegex.test(line.trim())) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        questionText: line.trim(),
        options: []
      };
    } else if (optionRegex.test(line.trim()) || correctOptionRegex.test(line.trim())) {
      const isCorrect = correctOptionRegex.test(line.trim());
      const optionText = line.replace(/^[A-D]\)\s*/, '').replace(/^\./, '').trim();

      currentQuestion.options.push({
        text: optionText,
        isCorrect: isCorrect // To'g'ri javobni belgilash
      });
    } else if (line.trim().length > 0) {
      // Noto'g'ri formatdagi qatorlarni ham variant sifatida qo'shish
      currentQuestion.options.push({
        text: line.trim(),
        isCorrect: false // Noto'g'ri javob
      });
      console.warn(`Noto'g'ri formatdagi qator qo'shildi: ${line}`);
    }
  });

  // Oxirgi savolni ham qo'shamiz
  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  // Agar savollar to'g'ri formatda bo'lmasa, null qaytaramiz
  return questions.length > 0 ? questions : null;
}

module.exports = { extractQuestionsFromWord };
