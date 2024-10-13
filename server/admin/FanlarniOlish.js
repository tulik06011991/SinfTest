const Subject = require('../Model/Fanlar'); // Subject modelini import qilamiz
const Admin = require('../Model/adminlar'); // Admin modelini import qilamiz

// Fanlar ro'yxatini olish va adminId bo'yicha filtrlash
const getSubjects = async (req, res) => {
  const { fanId } = req.body; // Bodydan fanId ni olamiz


  try {
    let subjects;
    if (fanId) {
      // fanId bo'yicha fanlarni olamiz
      subjects = await Subject.find({ _id: fanId }).select('name'); // Faqat fan nomini olamiz
    } else {
      return res.status(400).json({ message: 'FanId berilmagan!' });
    }


    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};

const getSubjectId = async (req, res) => {
  const { fanId } = req.params; // Bodydan fanId ni olamiz


  try {
    let subjects;
    if (fanId) {
      // fanId bo'yicha fanlarni olamiz
      subjects = await Subject.find({ _id: fanId }).select('name'); // Faqat fan nomini olamiz
    } else {
      return res.status(400).json({ message: 'FanId berilmagan!' });
    }


    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};


// Subject modelini import qilish

// Barcha fanlar ID va nomlarini qaytaradigan funksiya
const getAllSubjects = async (req, res) => {
  try {
    // Fanlarni ID va nomi bilan olish
    const subjects = await Subject.find().select('_id name');

    res.status(200).json({ subjects }); // Fanlarni muvaffaqiyatli qaytarish
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fanlarni olishda xato yuz berdi!' });
  }
};



module.exports = {
  getSubjects,
  getAllSubjects,
  getSubjectId
};
