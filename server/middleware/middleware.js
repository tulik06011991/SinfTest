const jwt = require('jsonwebtoken');

// Middleware for admin check
const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
if (!token) {
    return res.status(403).json({ message: 'Token mavjud emas!' });
}

    console.log(token)
    
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(403).json({ message: 'Tokenni tekshirishda xatolik!' });
    }
    
    next();
};

module.exports = adminMiddleware;
