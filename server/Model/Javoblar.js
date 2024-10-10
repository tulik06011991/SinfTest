const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: { // Foydalanuvchi nomi
        type: String,
        required: true, // Foydalanuvchi nomi zarur
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    answers: [
        {
            questionId: { // Savol ID sini qo'shish
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            selectedOption: { // Tanlangan variant textini kiritish
                type: String,
                required: true
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;



