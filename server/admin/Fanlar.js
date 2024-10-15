const Subject = require('../Model/Fanlar'); // Fan modelini chaqiramiz

// Fanlar ro'yxatini olish
exports.getAllSubjects = async (req, res) => {
    try {
        // Admin ma'lumotlari bilan birga fanlarni olish
        const subjects = await Subject.find().populate('adminId', 'name');
        res.status(200).json(subjects);
    } catch (error) {
        console.error('Fanlar ro\'yxatini olishda xato:', error);
        res.status(500).json({ error: 'Fanlar ro\'yxatini olishda xato yuz berdi!' });
    }
};

// Fan yaratish
exports.createSubject = async (req, res) => {
    try {
        const { name, adminId } = req.body;

        // Validatsiya: fan nomi va adminId tekshirish
        if (!name || !adminId) {
            return res.status(400).json({ message: 'Fan nomi va admin ID majburiy!' });
        }

        // Fan mavjudligini tekshirish
        const existingSubject = await Subject.findOne({ name });
        if (existingSubject) {
            return res.status(400).json({ message: 'Bunday fan nomi allaqachon mavjud' });
        }

        // Yangi fan yaratish
        const subject = new Subject({ name, adminId });
        await subject.save();
        res.status(201).json({ message: 'Fan muvaffaqiyatli yaratildi', subject });
    } catch (error) {
        console.error('Fan yaratishda xatolik:', error);
        res.status(500).json({ message: 'Fan yaratishda xatolik yuz berdi', error });
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
        console.error('Fan o\'chirishda xato:', error);
        res.status(500).json({ error: 'Fan o\'chirishda xato yuz berdi!' });
    }
};
