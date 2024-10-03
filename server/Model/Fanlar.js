const mongoose = require('mongoose');

// Fanlar schema
const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Fanlar modelini yaratish
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
