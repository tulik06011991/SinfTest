const Subject = require('../Model/Fanlar'); // Fan modelini chaqiramiz

// Fan yaratish
 // Fan modelini chaqiramiz

// Fan yaratish


// Fanlar ro'yxatini olish
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().populate('adminId', 'name'); // Fanlar bilan adminlarni ham qo'shish
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Fanlar ro\'yxatini olishda xato yuz berdi!' });
    }
};

// Fan o'chirish
exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params; // URL parametrlaridan ID olish

        // Fan o'chirish
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return res.status(404).json({ message: 'Fan topilmadi!' });
        }

        res.status(200).json({ message: 'Fan muvaffaqiyatli o\'chirildi!' });
    } catch (error) {
        res.status(500).json({ error: 'Fan o\'chirishda xato yuz berdi!' });
    }
};


exports.createSubject = async (req, res) => {
    try {
        const { name, adminId } = req.body;
        // Yangi fan yaratish
        console.log(name, adminId)
        
        const subject = new Subject({ name, adminId });
        await subject.save();
        res.status(201).json({ message: 'Fan muvaffaqiyatli yaratildi', subject });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Bunday fan nomi allaqachon mavjud' });
        }
        res.status(500).json({ message: 'Fan yaratishda xatolik yuz berdi', error });
    }
};
