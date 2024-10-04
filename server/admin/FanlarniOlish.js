const Subject = require('../Model/Fanlar'); // Subject modelini import qilamiz
const Admin = require('../Model/adminlar'); // Admin modelini import qilamiz

// Fanlar ro'yxatini olish va adminId bo'yicha filtrlash
const getSubjects = async (req, res) => {
  const { adminId } = req.params; // URL orqali adminId ni olamiz (bo'lishi mumkin)

  try {
    let subjects;
    if (adminId) {
      // Agar adminId mavjud bo'lsa, faqat shu adminga tegishli fanlarni olamiz
      subjects = await Subject.find({ adminId }).populate('adminId', 'name');
    } else {
      // Agar adminId berilmagan bo'lsa, barcha fanlarni olamiz
      subjects = await Subject.find().populate('adminId', 'name');
    }

    res.status(200).json(subjects); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};

module.exports = {
  getSubjects,
};
