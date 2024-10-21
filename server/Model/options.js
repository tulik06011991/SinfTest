const mongoose = require('mongoose');

// Variant modeli
const optionSchema = new mongoose.Schema({
    optionText: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' } // Savol ID'si bilan bog'lanadi
});

const Option = mongoose.model('Option', optionSchema);
module.exports = Option;
