// Model/Results.js
const mongoose = require('mongoose');

const resultsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    correctAnswersCount: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctPercentage: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const Results = mongoose.model('Results', resultsSchema);

module.exports = Results;
