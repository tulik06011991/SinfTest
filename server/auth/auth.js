const Admin = require('../Model/adminlar'); // Admin modelini import qilish
const User = require('../Model/auth'); // User modelini import qilish
const Subject = require('../Model/Fanlar'); // Fanlar modelini import qilish
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// Register Controller
const registerController = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu email bilan foydalanuvchi mavjud!' });
        }

        const user = new User({
            name,
            email,
            password,
            
        });

        await user.save();
        res.status(201).json({ message: 'Foydalanuvchi muvaffaqiyatli ro\'yxatdan o\'tdi!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverda xato yuz berdi!' });
    }
};




const loginController = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    

    try {
        // Superadmin emailini tekshirish
        if (email === 'Abdumuhammad@gmail.com') {
            const admin = await Admin.findOne({ email });
            if (!admin) {
                return res.status(400).json({ message: 'Admin topilmadi!' });
            }

            // Parolni tekshirish
            const isMatch = await admin.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
            }

            // Barcha fanlar
            const allSubjects = await Subject.find({}).select('_id name');

            // JWT token yaratish
            const token = jwt.sign({ userId: admin._id, role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '5h' });

            return res.status(200).json({
                token,
                redirect: '/superadmin/dashboard',
                subjects: allSubjects
            });
        }

        // Oddiy admin uchun login
        const admin = await Admin.findOne({ email });
        console.log(admin);
        
        if (admin) {
            // Parolni tekshirish
            const isMatch = await admin.comparePassword(password);
            console.log(isMatch)
            if (!isMatch) {
                return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
            }

            // Adminning o'ziga tegishli fanlar ro'yxati
            const allSubjects = await Subject.find("_id").select('_id name');

            // JWT token yaratish
            const token = jwt.sign({ userId: admin._id, role:'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({
                token,
                redirect: '/admin/dashboard',
                subjects: allSubjects
              
            });
        }

        // Foydalanuvchini tekshirish
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Foydalanuvchi topilmadi!' });
        }

        // Foydalanuvchi parolini tekshirish
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Noto\'g\'ri parol!' });
        }

        // JWT token yaratish
        const token = jwt.sign({ userId: user._id, userName: user.name, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({
            token,
            redirect: '/savollarjavoblar'
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
