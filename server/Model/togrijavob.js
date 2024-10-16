const mongoose = require('mongoose');

const correctAnswerSchema = new mongoose.Schema({
    correctAnswerText: { type: String, required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }
});

const CorrectAnswer = mongoose.model('CorrectAnswer', correctAnswerSchema);
module.exports = CorrectAnswer;
