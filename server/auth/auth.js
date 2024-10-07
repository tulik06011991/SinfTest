const Admin = require('../Model/adminlar'); // Admin modelini import qilish
const User = require('../Model/auth');
const Subject = require('../Model/Fanlar') // User modelini import qilish
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Controller
const registerController = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email bilan foydalanuvchi mavjud!' });
        }

        const user = new User({
            name,
            email,
            password,
            role // Admin yoki user
        });

        await user.save();
        res.status(201).json({ message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverda xato yuz berdi!' });
    }
};

// Login Controller
const loginController = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Adminni qidirish
        const admin = await Admin.findOne({ email });
        if (admin) {
            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
            }

            // Adminning o'ziga tegishli fanlar ro'yxatini olish
            const subjects = await Subject.find({ adminId: admin._id }).select('_id name');

            // JWT token yaratish
            const token = jwt.sign({ userId: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '5h' });

            // Fanlar bilan birga tokenni jo'natish
            return res.status(200).json({ 
                token, 
                redirect: '/admin/dashboard',
                subjects // Adminning o'ziga tegishli fanlar
            });
        }

        // Agar admin topilmasa, userni qidirish
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Foydalanuvchi topilmadi!' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
        }

        // Foydalanuvchi admin bo'lmasa savollarjavoblar sahifasiga yo'naltirish
        const adminIdCheck = await Admin.findById(user._id);
        if (!adminIdCheck) {
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ token, redirect: '/savollarjavoblar' });
        }

        // Agar user admin IDsi bo'lsa user dashboardga yo'naltirish
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token, redirect: '/user/dashboard' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Serverda xato yuz berdi!' });
    }
};


module.exports = { registerController, loginController };
