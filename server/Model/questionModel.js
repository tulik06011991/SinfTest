const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    fanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan', // Fanga bog'lash
        required: true
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
