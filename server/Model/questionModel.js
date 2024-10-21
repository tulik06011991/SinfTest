const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    fanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fan', // Fan modeliga ishora qiladi
        required: true
    },
    options: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    }]
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
