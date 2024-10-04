const User = require('../Model/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT token yaratish funksiyasi
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Ro'yxatdan o'tish (Register)
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Foydalanuvchi mavjudligini tekshirish
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Foydalanuvchi allaqachon mavjud' });
        }

        // Foydalanuvchini yaratish
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Token yaratish va qaytarish
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Foydalanuvchini yaratishda xatolik yuz berdi' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ro\'yxatdan o\'tishda xatolik' });
    }
};

// Kirish (Login)
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Foydalanuvchini topish
        const user = await User.findOne({ email });

        // Parolni tekshirish va token yaratish
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email yoki parol noto\'g\'ri' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Kirishda xatolik yuz berdi' });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
