const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    options: [
        {
            optionText: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                default: false
            }
        }
    ],
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', // Savol bilan bog'lanish
        required: true
    }
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;
