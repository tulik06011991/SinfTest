const mongoose = require('mongoose');

// Fan schema
const subjectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true
    },
    adminId: { 
        type: mongoose.Schema.Types.ObjectId, // Adminning ID si
        ref: 'Admin', // Admin modeliga ishora qiladi
        required: true
    }
});

// Fan modelini yaratish
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
