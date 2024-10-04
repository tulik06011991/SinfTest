const jwt = require('jsonwebtoken');
const User = require('../Model/auth');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; // Tokenni olish

            // Tokenni tekshirish
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Foydalanuvchini token orqali olish
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            res.status(401).json({ message: 'Token noto\'g\'ri' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Token mavjud emas, kirish talab qilinadi' });
    }
};

module.exports = protect;
