const Admin = require('../Model/adminlar'); // Admin modelini chaqiramiz
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Adminlarni yaratish
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, subject } = req.body;

        // Email bo'yicha admin bor-yo'qligini tekshirish
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Bu email bilan admin allaqachon mavjud!' });
        }

        // Yangi admin yaratish
        const newAdmin = new Admin({
            name,
            email,
            password,
            subject,
            role: 'admin'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'Admin muvaffaqiyatli yaratildi!', newAdmin });
    } catch (error) {
        res.status(400).json({ error: 'Admin yaratishda xato yuz berdi!' });
    }
};


// Barcha adminlarni olish
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Adminlarni olishda xato yuz berdi!' });
    }
};

// Adminni yangilash
exports.updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Validatsiya
        if (updates.role && updates.role !== 'admin') {
            return res.status(400).json({ error: 'Admin roli faqat "admin" bo\'lishi mumkin!' });
        }

        // Adminni yangilash
        const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin topilmadi!' });
        }

        res.status(200).json({ message: 'Admin muvaffaqiyatli yangilandi!', updatedAdmin });
    } catch (error) {
        res.status(400).json({ error: 'Adminni yangilashda xato yuz berdi!' });
    }
};

// Adminni o'chirish
exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        // Adminni o'chirish
        const deletedAdmin = await Admin.findByIdAndDelete(id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin topilmadi!' });
        }

        res.status(200).json({ message: 'Admin muvaffaqiyatli o\'chirildi!' });
    } catch (error) {
        res.status(500).json({ error: 'Adminni o\'chirishda xato yuz berdi!' });
    }
};
