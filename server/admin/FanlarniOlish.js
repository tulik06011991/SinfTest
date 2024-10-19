const Subject = require('../Model/Fanlar'); // Subject modelini import qilamiz
const Admin = require('../Model/adminlar'); // Admin modelini import qilamiz

// Fanlar ro'yxatini olish va fanId bo'yicha filtrlash
const getSubjects = async (req, res) => {
  const { fanId } = req.body; // Body'dan fanId ni olamiz

  try {
    if (!fanId) {
      return res.status(400).json({ message: 'FanId berilmagan!' });
    }

    // fanId bo'yicha fanlarni olamiz
    const subjects = await Subject.findById(fanId).select('name'); // Faqat fan nomini olamiz
    if (!subjects) {
      return res.status(404).json({ message: 'Fan topilmadi!' });
    }

    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error('Fanlarni olishda xato:', error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};

// Fan Id bo'yicha fan nomini olish
const getSubjectId = async (req, res) => {
  const { fanId } = req.params; // Params'dan fanId ni olamiz

  try {
    if (!fanId) {
      return res.status(400).json({ message: 'FanId berilmagan!' });
    }

    // fanId bo'yicha fanlarni olamiz
    const subjects = await Subject.findById(fanId).select('name'); // Faqat fan nomini olamiz
    if (!subjects) {
      return res.status(404).json({ message: 'Fan topilmadi!' });
    }

    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error('Fanlarni olishda xato:', error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};

// Barcha fanlar ID va nomlarini qaytaradigan funksiya
const getAllSubjects = async (req, res) => {
  try {
    // Fanlarni ID va nomi bilan olish
    const subjects = await Subject.find().select('_id name')
    console.log(subjects);
    
    if (!subjects || subjects.length === 0) {
      return res.status(404).json({ message: 'Fanlar topilmadi!' });
    }

    res.status(200).json(subjects ); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error('Fanlarni olishda xato:', error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};

module.exports = {
  getSubjects,
  getAllSubjects,
  getSubjectId
};
