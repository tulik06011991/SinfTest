const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
        required: true,
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    // To'g'ri javob bo'lsa true, aks holda false
    isCorrect: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;















// const mongoose = require('mongoose');

// const answerSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
//     questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
//     optionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Option', required: true }, // Variant ID
//     isCorrect: { type: Boolean, required: true } // To'g'ri yoki noto'g'ri javob
// });

// const Answer = mongoose.model('Answer', answerSchema);
// module.exports = Answer;
