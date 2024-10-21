const mongoose = require('mongoose');

// Savol modeli
const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Option' }] // Variantlar bilan bog'lanish
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
