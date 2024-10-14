const Admin = require('../Model/adminlar'); // Admin modelini import qilish
const User = require('../Model/auth'); // User modelini import qilish
const Subject = require('../Model/Fanlar'); // Fanlar modelini import qilish
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

        const hashedPassword = await bcrypt.hash(password, 12); // Parolni xesh qilish
        const user = new User({
            name,
            email,
            password: hashedPassword, // Xeshlangan parolni saqlash
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
        // Adminni email orqali qidirish
        const admin = await Admin.findOne({ email });
        
        // Eng yuqori admin uchun maxsus shart
        if (email === 'Abdumuhammad@gmail.com' && admin) {
            // Parolni tekshirish
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
            }

            // Barcha fanlar va foydalanuvchilarga kirish huquqiga ega bo'lgan eng yuqori admin
            const allSubjects = await Subject.find({}).select('_id name');

            // JWT token yaratish (eng yuqori admin uchun)
            const token = jwt.sign({ userId: admin._id, role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '5h' });

            return res.status(200).json({ 
                token, 
                redirect: '/superadmin/dashboard', 
                subjects: allSubjects 
            });
        }

        if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
            }

            const subjects = await Subject.find({ adminId: admin._id }).select('_id name');
            if (subjects.length === 0) {
                return res.status(404).json({ message: 'Bu admin uchun fanlar topilmadi!' });
            }

            const token = jwt.sign({ userId: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ 
                token, 
                redirect: '/admin/dashboard',
                subjects 
            });
        }

        // Agar admin topilmasa, foydalanuvchini qidirish
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Foydalanuvchi topilmadi!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
        }

        const token = jwt.sign({ userId: user._id, userName: user.name, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ 
            token, 
            redirect: '/savollarjavoblar',
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Serverda xato yuz berdi!' });
    }
};

// Foydalanuvchilarni olish
const getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Barcha foydalanuvchilarni olish
        res.status(200).json(users); // Foydalanuvchilar ro'yxatini qaytarish
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik', error: error.message });
    }
};

// Foydalanuvchini yaratish
const createUser = async (req, res) => {
    const { name, email, password, role } = req.body; // So'rovdan ma'lumotlarni olish

    try {
        const userExists = await User.findOne({ email }); // Foydalanuvchi mavjudligini tekshirish
        if (userExists) {
            return res.status(400).json({ message: 'Bu elektron pochta allaqachon ro\'yxatdan o\'tgan.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12); // Parolni xesh qilish
        const newUser = await User.create({ name, email, password: hashedPassword, role }); // Yangi foydalanuvchini yaratish

        res.status(201).json(newUser); // Yaratilgan foydalanuvchini qaytarish
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini yaratishda xatolik', error: error.message });
    }
};

// Foydalanuvchini o'chirish
const deleteUser = async (req, res) => {
    const { id } = req.params; 

    try {
        const deletedUser = await User.findByIdAndDelete(id); // Foydalanuvchini o'chirish
        if (!deletedUser) {
            return res.status(404).json({ message: 'Foydalanuvchi topilmadi.' });
        }
        res.status(200).json({ message: 'Foydalanuvchi muvaffaqiyatli o\'chirildi.' });
    } catch (error) {
        res.status(500).json({ message: 'Foydalanuvchini o\'chirishda xatolik', error: error.message });
    }
};

module.exports = {
    registerController,
    loginController,
    getUsers,
    
    deleteUser,
};
