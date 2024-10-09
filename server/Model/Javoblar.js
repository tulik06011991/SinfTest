const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: { // Yangi maydon qo'shildi
        type: String,
        required: true, // Foydalanuvchi nomi zarur
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    answers: {
        type: Map,
        of: String, // Savol ID va tanlangan javoblar
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;



