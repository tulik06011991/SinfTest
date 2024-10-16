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

    // Savollarni bazaga saqlash
    const savedQuestions = await Question.insertMany(questions);

    res.status(201).json({ message: 'Savollar muvaffaqiyatli saqlandi', savedQuestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Serverda xatolik yuz berdi' });
  } finally {
    // Yuklangan faylni o‘chirib tashlaymiz
    fs.unlinkSync(req.file.path);
  }
};

// JSON formatga o‘tkazish funksiyasi (ilgari ko'rsatgan kod)
function parseQuizData(text) {
  const lines = text.split('\n');
  let questions = [];
  let currentQuestion = null;

  lines.forEach(line => {
    // Savolni aniqlash: raqam bilan boshlanadi va oxirida nuqta yoki ? bilan tugaydi
    const questionRegex = /^\d+\..*\?|\d+\..*\.$/;
    // Variantlarni aniqlash: A), B), C), D) bilan boshlanadi
    const optionRegex = /^[A-D]\).+/;
    // To'g'ri variantlarni aniqlash: faqat nuqta bilan boshlangan variantlar .A), .B), .C), .D)
    const correctOptionRegex = /^\.[A-D]\).+/;

    if (questionRegex.test(line.trim())) {
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      currentQuestion = {
        questionText: line.trim(),
        options: []
      };
    } else if (optionRegex.test(line.trim())) {
      currentQuestion.options.push({
        text: line.replace(/^[A-D]\)\s*/, '').replace('*', '').trim(),
        isCorrect: false // Oldida nuqta bo'lmasa, noto'g'ri hisoblanadi
      });
    } else if (correctOptionRegex.test(line.trim())) {
      currentQuestion.options.push({
        text: line.replace(/^\.[A-D]\)\s*/, '').replace('*', '').trim(),
        isCorrect: true // Oldida nuqta bo'lsa, to'g'ri hisoblanadi
      });
    }
  });

  if (currentQuestion) {
    questions.push(currentQuestion);
  }

  return questions;
}

module.exports = { extractQuestionsFromWord };
