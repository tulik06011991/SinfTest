const express = require('express');
const router = express.Router();
const { registerController, loginController, getUsers,
    createUser,
    updateUser,
    deleteUser } = require('../auth/auth');
const middleware = require('../middleware/middleware')


// Ro'yxatdan o'tish (POST /api/users/register)
router.post('/register',  registerController);

// Kirish (POST /api/users/login)
router.post('/login',  loginController);


// Foydalanuvchilar uchun marshrutlar
router.get('/dashboard',  getUsers); // Barcha foydalanuvchilarni olish
router.post('/dashboard', createUser); // Foydalanuvchini yaratish
router.put('/users/:id', updateUser); // Foydalanuvchini yangilash
router.delete('/dashboard/:id', deleteUser); // Foydalanuvchini o'chirish




module.exports = router;
