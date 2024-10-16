const mongoose = require('mongoose');

// Variantlar schema
const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

// Savol schema
const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [OptionSchema], // Har bir savolning variantlari bo'ladi
  createdAt: { type: Date, default: Date.now }
});

const Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;
